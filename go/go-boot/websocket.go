package go_boot

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"runtime"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/wxyyxc1992/go-boot/utils/convert"
)

func (s *Server) handleWebSocketConnection(conn *websocket.Conn) error {
	wsn := &webSocketConn{mutex: sync.Mutex{}, conn: conn}
	var ctx Context = &ContextWebsocket{Conn: wsn}

	if s.constructHandler != nil {
		s.constructHandler.Handle(ctx)
	}

	defer func() {
		if s.destructHandler != nil {
			s.destructHandler.Handle(ctx)
		}

		conn.Close()
	}()

	var (
		bType         = make([]byte, 4)
		bSequence     = make([]byte, 8)
		bHeaderLength = make([]byte, 4)
		bBodyLength   = make([]byte, 4)
		sequence      int64
		headerLength  uint32
		bodyLength    uint32
	)

	conn.SetReadLimit(MaxPayload)

	for {
		if s.config.Timeout != 0 {
			conn.SetReadDeadline(time.Now().Add(s.config.Timeout))
			conn.SetWriteDeadline(time.Now().Add(s.config.Timeout))
		}

		_, r, err := conn.NextReader()
		if err != nil {
			return err
		}

		if _, err := io.ReadFull(r, bType); err != nil {
			return err
		}

		if _, err := io.ReadFull(r, bSequence); err != nil {
			return err
		}

		if _, err := io.ReadFull(r, bHeaderLength); err != nil {
			return err
		}

		if _, err := io.ReadFull(r, bBodyLength); err != nil {
			return err
		}

		sequence = convert.BytesToInt64(bSequence)
		headerLength = convert.BytesToUint32(bHeaderLength)
		bodyLength = convert.BytesToUint32(bBodyLength)
		pacLen := headerLength + bodyLength + uint32(20)

		if pacLen > s.config.MaxPayload {
			_, file, line, _ := runtime.Caller(1)
			return SystemError{time.Now(), file, line, "packet larger than MaxPayload"}
		}

		header := make([]byte, headerLength)
		if _, err := io.ReadFull(r, header); err != nil {
			return err

		}

		body := make([]byte, bodyLength)
		if _, err := io.ReadFull(r, body); err != nil {
			return err
		}

		rp, err := NewPacket(convert.BytesToUint32(bType), sequence, header, body, s.config.PluginForPacketReceiver)

		if err != nil {
			return err
		}

		ctx = NewContextWebsocket(wsn, rp.Operator, rp.Sequence, rp.Header, rp.Body, s.config)
		go s.handleWebSocketPacket(ctx, conn, rp)
	}
}

func (s *Server) handleWebSocketPacket(ctx Context, conn *websocket.Conn, rp Packet) {
	defer func() {
		if r := recover(); r != nil {
			if s.errorHandler != nil {
				buf := make([]byte, 1<<12)
				n := runtime.Stack(buf, false)
				s.errorHandler(errors.New(string(buf[:n])))
			}
		}
	}()

	if rp.Operator == OperatorHeartbeat {
		if s.pingHandler != nil {
			s.pingHandler.Handle(ctx)
		}

		ctx.Success(nil)
	}

	handler, ok := s.router.handlerContainer[rp.Operator]
	if !ok {
		ctx.Error(StatusInternalServerError, "server don't register your request.")
	}

	if rm, ok := s.router.routerMiddleware[rp.Operator]; ok {
		for _, v := range rm {
			ctx = v.Handle(ctx)
		}
	}

	for _, v := range s.router.middleware {
		ctx = v.Handle(ctx)
		if tm, ok := v.(TerminateMiddleware); ok {
			tm.Terminate(ctx)
		}
	}

	handler.Handle(ctx)
	ctx.Success(nil) // If it don't call the function of Success or Error, deal it by default
}

// RunWebSocket 开始运行webocket服务
func (s *Server) RunWebSocket(address string) error {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		var upgrade = websocket.Upgrader{
			HandshakeTimeout:  s.config.Timeout,
			ReadBufferSize:    s.config.ReadBufferSize,
			WriteBufferSize:   s.config.WriteBufferSize,
			EnableCompression: true,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		}

		conn, err := upgrade.Upgrade(w, r, nil)
		if err != nil {
			w.Write([]byte(err.Error()))
			return
		}

		go s.handleWebSocketConnection(conn)
	})

	fmt.Printf("websocket server running on %s\n", address)

	return http.ListenAndServe(address, nil)
}
