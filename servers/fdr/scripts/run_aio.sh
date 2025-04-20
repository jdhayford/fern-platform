#!/bin/bash
set -e


# TODO Pull ORG_NAME from relative fern folder

echo "Startig postgres..."
su postgres -c "postgres -D /var/lib/postgresql/data" &

echo "Waiting for postgres to start at localhost:5432..."
until nc -z localhost 5432; do
    sleep 1
done
echo "Postgres is up and running."

echo "Starting minio..."
minio server /data --address ":9000" --console-address ":9001" &
echo "Waiting for minio to start at localhost:9000..."
until nc -z localhost 9000; do
    sleep 1
done
until nc -z localhost 9001; do
    sleep 1
done
echo "Minio is up and running."

echo "Creating minio bucket..."
mc mb $ORG_NAME.docs.buildwithfern.com --region=global

echo "Startig fdr..."
prisma migrate deploy --schema /app/servers/fdr/prisma/schema.prisma
node --loader /app/servers/fdr/ts-loader.js --experimental-specifier-resolution=node /app/servers/fdr/dist/server.js