package go_boot

import (
	"hash/crc32"
	"strconv"
)

type (
	Router struct {
		prefix           string
		handlerContainer map[uint32]Handler
		routerMiddleware map[uint32][]Middleware
		middleware       []Middleware
	}

	LinkRouter func(*Router)
)

func NewRouter() *Router {
	return &Router{
		handlerContainer: make(map[uint32]Handler),
		routerMiddleware: make(map[uint32][]Middleware),
	}
}

// 获取带命名空间router
func (r *Router) NSRouter(prefix string, params ...LinkRouter) *Router {
	r.prefix = prefix
	for _, p := range params {
		p(r)
	}

	return r
}

// 命名空间路由注册路由和中间件
func (r *Router) NSRoute(pattern string, handler Handler, middleware ...Middleware) LinkRouter {
	return func(r *Router) {
		if r.prefix != "" {
			pattern = r.prefix + pattern
		}

		r.Route(pattern, handler, middleware...)
	}
}

// 注册路由，路由中间件
func (r *Router) Route(pattern string, handler Handler, middleware ...Middleware) *Router {
	operator := crc32.ChecksumIEEE([]byte(pattern))
	if operator <= OperatorMax {
		panic("Unavailable operator, the value of crc32 need less than " + strconv.Itoa(OperatorMax))
	}

	r.routerMiddleware[operator] = append(r.routerMiddleware[operator], middleware...)

	if _, ok := r.handlerContainer[operator]; !ok {
		r.handlerContainer[operator] = handler
	}

	return r
}

// 添加请求需要进行处理的中间件
func (r *Router) Use(middleware ...Middleware) *Router {
	r.middleware = append(r.middleware, middleware...)

	return r
}
