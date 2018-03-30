// @flow

/**
 * @function 设置请求与响应的通用头部数据
 * @param app
 */
export function header(app) {
  // x-response-time

  app.use(async function(ctx, next) {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    ctx.set('X-Response-Time', ms + 'ms');
  });
}

/**
 * @function 设置默认的权限检测
 * @param app
 * @param publicPath
 * @param privatePath
 */
export function auth(
  app,
  publicPath: [string] = null,
  privatePath: [string] = null
) {
  app.use(async function(ctx, next) {
    const url = ctx.request.url;

    //判断是否为根路径或者静态资源路径
    // Todo 这里暂时移除了自定义的
    // if (
    //   url === "/" ||
    //   url.indexOf("swagger") > -1 ||
    //   url.indexOf("static") > -1 ||
    //   url.indexOf("user") > -1
    // ) {
    await next();
    // } else {
    //   ctx.redirect("/");
    // }
  });
}

/**
 * @function 设置默认的日志工具
 * @param app
 */
export function logger(app) {
  app.use(async function(ctx, next) {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log('%s %s - %s', ctx.method, ctx.url, ms);
  });
}
