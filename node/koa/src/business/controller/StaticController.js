// @flow
const send = require("koa-send");
const path = require("path");

/**
 * Description 返回静态资源
 * @param root
 * @param opts
 * @returns {Function}
 */
export function serveStatic(root, opts) {
  opts = opts || {};
  opts.index = opts.index || "index.html";

  root = path.resolve(root);

  if (opts.debug) console.log('Static mounted on "%s"', root);

  return async function(ctx, next) {
    await next();

    if (ctx.method !== "GET" && ctx.method !== "HEAD") return;

    if (!!ctx.body || ctx.status !== 404) return;

    let file = ctx.params["0"] || "/" + opts.index;

    //判断是否存在后缀
    if (file[file.length - 1] === "/") {
      file += opts.index;
    }

    let requested = path.normalize(file);

    if (requested.length === 0 || requested === "/") requested = opts.index;

    await send(ctx, requested, { root: root });
  };
}
