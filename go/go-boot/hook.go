package go_boot

import (
	"net"
	"sync"

	"github.com/gorilla/websocket"
)

// fix panic as websocket concurrency write
type webSocketConn struct {
	mutex sync.Mutex
	conn  *websocket.Conn
}

func (ws *webSocketConn) WriteMessage(messageType int, data []byte) error {
	ws.mutex.Lock()
	err := ws.conn.WriteMessage(messageType, data)
	ws.mutex.Unlock()

	return err
}

func (ws *webSocketConn) LocalAddr() net.Addr {
	return ws.conn.LocalAddr()
}

func (ws *webSocketConn) RemoteAddr() net.Addr {
	return ws.conn.RemoteAddr()
}
