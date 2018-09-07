// @flow

async function errorHandler(ctx: Object, next: () => {}) {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.app.emit('error', err, ctx)
    ctx.type = 'application/json'
    ctx.body = { error: { message: err.message, status: ctx.status } }
  }
}

export default errorHandler
