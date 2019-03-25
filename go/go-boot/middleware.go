package go_boot

// 全局中间件,每个请求都有执行的操作
type Middleware interface {
	Handle(Context) Context
}

// 响应数据被发送到客户端以后需要执行的操作
type TerminateMiddleware interface {
	Handle(Context) Context
	Terminate(Context)
}
