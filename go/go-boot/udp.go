package go_boot

import (
	"fmt"
	"net"

	"github.com/wxyyxc1992/go-boot/utils/convert"
)

func (s *Server) handleUDPData(conn *net.UDPConn, remote *net.UDPAddr, data []byte, length int) {
	bType := data[0:4]
	bSequence := data[4:12]
	bHeaderLength := data[12:16]

	sequence := convert.BytesToInt64(bSequence)
	headerLength := convert.BytesToUint32(bHeaderLength)

	header := data[20 : 20+headerLength]
	body := data[20+headerLength : length]

	rp, err := NewPacket(convert.BytesToUint32(bType), sequence, header, body, s.config.PluginForPacketReceiver)
	if err != nil {
		return
	}

	var ctx Context = NewContextUdp(conn, remote, rp.Operator, rp.Sequence, rp.Header, rp.Body, s.config)
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

// 开始运行Tcp服务
func (s *Server) RunUDP(name, address string) error {
	udpAddr, err := net.ResolveUDPAddr(name, address)
	if err != nil {
		return err
	}

	conn, err := net.ListenUDP(name, udpAddr)
	if err != nil {
		return err
	}

	defer conn.Close()

	fmt.Printf("udp server running on %s\n", address)

	if s.config.ReadBufferSize > 0 {
		conn.SetReadBuffer(s.config.ReadBufferSize)
	}

	if s.config.WriteBufferSize > 0 {
		conn.SetWriteBuffer(s.config.WriteBufferSize)
	}

	if s.constructHandler != nil {
		s.constructHandler.Handle(nil)
	}

	for {
		data := make([]byte, MaxPayload)
		n, remote, err := conn.ReadFromUDP(data)
		if err != nil {
			continue
		}

		go s.handleUDPData(conn, remote, data, n)
	}
}
