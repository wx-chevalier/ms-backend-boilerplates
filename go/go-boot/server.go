package go_boot

import (
	"io"
	"log"

	"github.com/wxyyxc1992/go-boot/utils/codec"
)

const (
	MaxPayload = 1024 * 1024
)

const (
	OperatorHeartbeat = iota
	OperatorMax       = 1024
)

type (
	Handler interface {
		Handle(Context)
	}
	HandlerFunc  func(Context)
	ErrorHandler func(error)
	Server       struct {
		config           Config
		router           *Router
		errorHandler     ErrorHandler
		constructHandler Handler
		destructHandler  Handler
		pingHandler      Handler
	}
)

func NewServer(config Config) *Server {
	if config.ContentType == "" {
		config.ContentType = codec.JSON
	}

	if config.MaxPayload == 0 {
		config.MaxPayload = MaxPayload
	}

	return &Server{
		config: config,
		errorHandler: func(err error) {
			if err != io.EOF {
				log.Println(err.Error())
			}
		},
	}
}

// 设置默认错误处理方法
func (s *Server) OnError(errorHandler ErrorHandler) {
	s.errorHandler = errorHandler
}

// 客户端链接断开以后执行回收操作
func (s *Server) OnClose(handler Handler) {
	s.destructHandler = handler
}

// 客户端建立连接以后初始化操作
func (s *Server) OnOpen(handler Handler) {
	s.constructHandler = handler
}

// 设置心跳包的handler,需要客户端发送心跳包才能够触发
// 客户端发送心跳包，服务端未调用此方法时只起到建立长连接的作用
func (s *Server) OnPing(handler Handler) {
	s.pingHandler = handler
}

// 绑定路由
func (s *Server) BindRouter(r *Router) {
	s.router = r
}

func (f HandlerFunc) Handle(ctx Context) {
	f(ctx)
}
