package go_boot

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net"
	"runtime"
	"time"

	"github.com/wxyyxc1992/go-boot/utils/convert"
)

func (s *Server) handleTCPConnection(conn *net.TCPConn) error {
	ctx := &ContextTcp{common: common{Context: context.Background()}, Conn: conn}
	if s.constructHandler != nil {
		s.constructHandler.Handle(ctx)
	}

	defer func() {
		if s.destructHandler != nil {
			s.destructHandler.Handle(ctx)
		}

		conn.Close()
	}()

	if s.config.ReadBufferSize > 0 {
		conn.SetReadBuffer(s.config.ReadBufferSize)
	}

	if s.config.WriteBufferSize > 0 {
		conn.SetWriteBuffer(s.config.WriteBufferSize)
	}

	var (
		bType         = make([]byte, 4)
		bSequence     = make([]byte, 8)
		bHeaderLength = make([]byte, 4)
		bBodyLength   = make([]byte, 4)
		sequence      int64
		headerLength  uint32
		bodyLength    uint32
	)

	for {
		if s.config.Timeout != 0 {
			conn.SetDeadline(time.Now().Add(s.config.Timeout))
		}

		if _, err := io.ReadFull(conn, bType); err != nil {
			return err
		}

		if _, err := io.ReadFull(conn, bSequence); err != nil {
			return err
		}

		if _, err := io.ReadFull(conn, bHeaderLength); err != nil {
			return err
		}

		if _, err := io.ReadFull(conn, bBodyLength); err != nil {
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
		if _, err := io.ReadFull(conn, header); err != nil {
			return err
		}

		body := make([]byte, bodyLength)
		if _, err := io.ReadFull(conn, body); err != nil {
			return err
		}

		rp, err := NewPacket(convert.BytesToUint32(bType), sequence, header, body, s.config.PluginForPacketReceiver)

		if err != nil {
			return err
		}

		ctx = NewContextTcp(ctx.Context, conn, rp.Operator, rp.Sequence, rp.Header, rp.Body, s.config)
		go s.handleTCPPacket(ctx, rp)
	}
}

func (s *Server) handleTCPPacket(ctx Context, rp Packet) {
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

// RunTCP 开始运行Tcp服务
func (s *Server) RunTCP(name, address string) error {
	tcpAddr, err := net.ResolveTCPAddr(name, address)
	if err != nil {
		return err
	}

	listener, err := net.ListenTCP(name, tcpAddr)
	if err != nil {
		return err
	}

	defer listener.Close()

	fmt.Printf("tcp server running on %s\n", address)
	for {
		conn, err := listener.AcceptTCP()
		if err != nil {
			continue
		}

		go s.handleTCPConnection(conn)
	}
}
