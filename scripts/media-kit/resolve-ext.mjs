// Lets plain Node import the site's lib/ files, which use extensionless imports (Next.js resolves them; Node does not).
import { register } from "node:module";
register("data:text/javascript," + encodeURIComponent(`
export async function resolve(spec, ctx, next) {
  try { return await next(spec, ctx); }
  catch (e) { if (spec.startsWith(".") || spec.startsWith("/")) { for (const ext of [".js", ".json", "/index.js"]) { try { return await next(spec + ext, ctx); } catch {} } } throw e; }
}`));
