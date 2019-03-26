package go_boot

import (
	"context"
	"hash/crc32"
	"runtime"
	"strconv"

	"github.com/gorilla/websocket"
	"github.com/wxyyxc1992/go-boot/utils/codec"
)

var _ Context = new(ContextWebsocket)

type ContextWebsocket struct {
	common
	Conn *webSocketConn
}

func NewContextWebsocket(conn *webSocketConn, OperateType uint32, Sequence int64, Header, Body []byte, config Config) *ContextWebsocket {
	return &ContextWebsocket{
		common: common{
			Context:     context.Background(),
			operateType: OperateType,
			sequence:    Sequence,
			config:      config,
			Request:     struct{ Header, Body []byte }{Header: Header, Body: Body},
			body:        Body,
		},
		Conn: conn,
	}
}

// 响应请求成功的数据包
func (c *ContextWebsocket) Success(body interface{}) {
	r, err := codec.NewCoder(c.config.ContentType)
	if err != nil {
		panic(err)
	}

	data, err := r.Encoder(body)
	if err != nil {
		panic(err)
	}

	p, err := NewPacket(c.operateType, c.sequence, c.Response.Header, data, c.config.PluginForPacketSender)

	if err != nil {
		panic(err)
	}

	c.Conn.WriteMessage(websocket.BinaryMessage, p.Bytes())

	runtime.Goexit()
}

// 响应请求失败的数据包
func (c *ContextWebsocket) Error(code int, message string) {
	c.SetResponseProperty("code", strconv.Itoa(code))
	c.SetResponseProperty("message", message)

	p, err := NewPacket(c.operateType, c.sequence, c.Response.Header, nil, c.config.PluginForPacketSender)

	if err != nil {
		panic(err)
	}

	c.Conn.WriteMessage(websocket.BinaryMessage, p.Bytes())

	runtime.Goexit()
}

// 向客户端发送数据
func (c *ContextWebsocket) Write(operator string, body interface{}) (int, error) {
	r, err := codec.NewCoder(c.config.ContentType)
	if err != nil {
		return 0, err
	}

	data, err := r.Encoder(body)
	if err != nil {
		return 0, err
	}

	p, err := NewPacket(crc32.ChecksumIEEE([]byte(operator)), 0, c.Response.Header, data, c.config.PluginForPacketSender)

	if err != nil {
		panic(err)
	}

	return 0, c.Conn.WriteMessage(websocket.BinaryMessage, p.Bytes())
}

func (c *ContextWebsocket) LocalAddr() string {
	return c.Conn.LocalAddr().String()
}

func (c *ContextWebsocket) RemoteAddr() string {
	return c.Conn.RemoteAddr().String()
}
