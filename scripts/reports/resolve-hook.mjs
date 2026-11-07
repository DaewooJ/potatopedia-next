// Lets plain Node import the app's lib/*.js modules, which use extensionless relative imports (Next resolves those).
import { registerHooks } from "node:module";
registerHooks({
  resolve(spec, ctx, next) {
    if ((spec.startsWith("./") || spec.startsWith("../")) && !/\.[cm]?jsx?$|\.json$/.test(spec)) {
      try { return next(spec + ".js", ctx); } catch {}
    }
    return next(spec, ctx);
  },
});
