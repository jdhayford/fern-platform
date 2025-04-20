export const isLocal = () => {
  return process.env.NEXT_PUBLIC_IS_LOCAL === "1" || process.env["LOCAL_MODE_OVERRIDE"] === "true";
};
