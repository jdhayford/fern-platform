#!/bin/bash
set -e

# Check for fern folder
if [ ! -d "/app/fern" ]; then
    echo "Fern folder not found. Please ensure you are mounting yours in."
    exit 1
fi

# TODO Pull ORG_NAME from relative fern folder

echo "Updating /etc/hosts to include $ORG_NAME.docs.buildwithfern.com.localhost"
echo "
127.0.0.1 $ORG_NAME.docs.buildwithfern.com.localhost
::1 $ORG_NAME.docs.buildwithfern.com.localhost
" >> /etc/hosts

echo "Startig postgres..."
su postgres -c "postgres -D /var/lib/postgresql/data" &
postgres_pid=$!

echo "Waiting for postgres to start at localhost:5432..."
until nc -z localhost 5432; do
    sleep 1
done
echo "Postgres is up and running."

echo "Starting minio..."
minio server /mindata --address ":9000" --console-address ":9001" &
minio_pid=$!

echo "Waiting for minio to start at localhost:9000..."
until nc -z localhost 9000; do
    sleep 1
done
until nc -z localhost 9001; do
    sleep 1
done
echo "Minio is up and running."

echo "Creating minio bucket..."
mc alias remove play
mc alias remove s3
mc alias remove gcs

mc alias set local http://localhost:9000 minioadmin minioadmin
mc mb local/$ORG_NAME.docs.buildwithfern.com

echo "Startig fdr..."
prisma migrate deploy --schema /app/servers/fdr/prisma/schema.prisma
node --loader /app/servers/fdr/ts-loader.js --experimental-specifier-resolution=node /app/servers/fdr/dist/server.js &
fdr_pid=$!

echo "Waiting for fdr to start at localhost:8080..."
until nc -z localhost 8080; do
    sleep 1
done
echo "FDR is up and running."

cd /app/fern
ls -la
ls -la 
FERN_AUTH_NO_VERIFY=true FERN_TOKEN=abc FERN_NO_VERSION_REDIRECTION=true DEFAULT_FDR_ORIGIN=http://localhost:8080 node /usr/local/lib/fern/dist/local/cli.cjs generate --docs --log-level=trace --local


FDR_ORIGIN=http://localhost:8080 QSTASH_TOKEN=foo NEXT_PUBLIC_IS_LOCAL=1 FERN_TOKEN=abc pnpm run docs:start
docs_pid=$!
echo "Waiting for docs to start at localhost:3000..."
until nc -z localhost 3000; do
    sleep 1
done

# Wait for all background processes and check their exit statuses
wait $postgres_pid || { echo "postgres failed"; exit 1; }
wait $minio_pid || { echo "minio failed"; exit 1; }
wait $fdr_pid || { echo "fdr failed"; exit 1; }
wait $docs_pid || { echo "docs failed"; exit 1; }