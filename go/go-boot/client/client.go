package client

import (
	"bytes"
	"errors"
	"hash/crc32"
	"io"
	"net"
	"strconv"
	"strings"
	"sync"
	"time"

	goBoot "github.com/wxyyxc1992/go-boot"
	"github.com/wxyyxc1992/go-boot/plugins"
)

const (
	// MaxPayload max packet size
	MaxPayload = 1024 * 1024

	// Version sdk version
	Version = "1.0"
)

// Connection status
const (
	CONNECTING = 0 // 连接还没开启
	OPEN       = 1 // 连接已开启并准备好进行通信
	CLOSING    = 2 // 连接正在关闭的过程中
	CLOSED     = 3 // 连接已经关闭，或者连接无法建立
)

// Handler handle the connection
type Handler interface {
	Handle(header, body []byte)
}

// RequestStatusCallback 请求状态回调
type RequestStatusCallback interface {
	OnSuccess(header, body []byte)
	OnError(status int, message string)
	OnStart()
	OnEnd()
}

// ReadyStateCallback 链接状态回调
type ReadyStateCallback interface {
	OnOpen()
	OnClose()
	OnError(err string)
}

// Client 客户端结构体
type Client struct {
	conn                   net.Conn
	closed                 bool
	readyStateCallback     ReadyStateCallback
	readyState             int
	mutex                  *sync.Mutex
	rwMutex                *sync.RWMutex
	timeout, retryInterval time.Duration
	handlerContainer       sync.Map
	packet                 chan goBoot.Packet
	maxPayload             int32
	request, response      struct {
		Header, Body []byte
	}
}

type handlerFunc func(header, body []byte)

func (f handlerFunc) Handle(header, body []byte) {
	f(header, body)
}

// NewClient 初始化客户端链接
func NewClient(server string, port int, readyStateCallback ReadyStateCallback) *Client {
	c := &Client{
		readyState:       CONNECTING,
		mutex:            new(sync.Mutex),
		rwMutex:          new(sync.RWMutex),
		retryInterval:    5 * time.Second,
		packet:           make(chan goBoot.Packet, 1024),
		handlerContainer: sync.Map{},
	}

	if readyStateCallback != nil {
		c.readyStateCallback = readyStateCallback
	}

	go c.connect(server, port)

	return c
}

// GetReadyState 获取链接运行状态
func (c *Client) GetReadyState() int {
	return c.readyState
}

// Ping 心跳处理，客户端与服务端保持长连接
func (c *Client) Ping(param []byte, callback RequestStatusCallback) error {
	if callback == nil {
		return errors.New("callback can't be nil")
	}

	if c.readyState != OPEN {
		return errors.New("ping getsockopt: connection refuse")
	}

	sequence := time.Now().UnixNano()
	listener := int64(goBoot.OperatorHeartbeat) + sequence

	c.handlerContainer.Store(listener, handlerFunc(func(header, body []byte) {
		code := c.GetResponseProperty("code")
		if code != "" {
			message := c.GetResponseProperty("message")
			v, _ := strconv.Atoi(code)
			callback.OnError(v, message)
		} else {
			callback.OnSuccess(header, body)
			callback.OnEnd()
		}
	}))

	// 建立连接以后就发送心跳包建立会话信息，后面的定期发送
	p, err := goBoot.NewPacket(goBoot.OperatorHeartbeat, sequence, c.request.Header, param, []goBoot.PacketPlugin{
		&plugins.Encryption{},
	})

	if err != nil {
		return err
	}

	c.packet <- p

	return nil
}

// SyncSend 向服务端发送请求，同步处理服务端返回结果
func (c *Client) SyncSend(operator string, param []byte, callback RequestStatusCallback) error {
	if callback == nil {
		return errors.New("callback can't be nil")
	}

	if c.readyState != OPEN {
		return errors.New("SyncSend getsockopt: connection refuse")
	}

	nType := crc32.ChecksumIEEE([]byte(operator))
	sequence := time.Now().UnixNano()
	listener := int64(nType) + sequence

	// 对数据请求的返回状态进行处理,同步阻塞处理机制
	c.mutex.Lock()
	quit := make(chan bool)

	callback.OnStart()

	c.handlerContainer.Store(listener, handlerFunc(func(header, body []byte) {
		code := c.GetResponseProperty("code")
		if code != "" {
			message := c.GetResponseProperty("message")
			v, _ := strconv.Atoi(code)
			callback.OnError(v, message)
		} else {
			callback.OnSuccess(header, body)
		}

		callback.OnEnd()

		c.handlerContainer.Delete(listener)
		quit <- true
	}))

	p, err := goBoot.NewPacket(nType, sequence, c.request.Header, param, []goBoot.PacketPlugin{
		&plugins.Encryption{},
	})

	if err != nil {
		return err
	}

	c.packet <- p
	<-quit
	c.mutex.Unlock()

	return nil
}

// AsyncSend 向服务端发送请求，异步处理服务端返回结果
func (c *Client) AsyncSend(operator string, param []byte, callback RequestStatusCallback) error {
	if callback == nil {
		return errors.New("callback can't be nil")
	}

	if c.readyState != OPEN {
		return errors.New("AsyncSend getsockopt: connection refuse")
	}

	nType := crc32.ChecksumIEEE([]byte(operator))
	sequence := time.Now().UnixNano()

	listener := int64(nType) + sequence
	callback.OnStart()

	c.handlerContainer.Store(listener, handlerFunc(func(header, body []byte) {
		code := c.GetResponseProperty("code")
		if code != "" {
			message := c.GetResponseProperty("message")
			v, _ := strconv.Atoi(code)
			callback.OnError(v, message)
		} else {
			callback.OnSuccess(header, body)
		}

		callback.OnEnd()

		c.handlerContainer.Delete(listener)
	}))

	p, err := goBoot.NewPacket(nType, sequence, c.request.Header, param, []goBoot.PacketPlugin{
		&plugins.Encryption{},
	})

	if err != nil {
		return err
	}

	c.packet <- p

	return nil
}

// SetMaxPayload 设置可处理的数据包的最大长度
func (c *Client) SetMaxPayload(maxPayload int32) {
	c.maxPayload = maxPayload
}

// AddMessageListener 添加事件监听器
func (c *Client) AddMessageListener(listener string, callback Handler) {
	c.handlerContainer.Store(int64(crc32.ChecksumIEEE([]byte(listener))), callback)
}

// RemoveMessageListener 移除事件监听器
func (c *Client) RemoveMessageListener(listener string) {
	c.handlerContainer.Delete(int64(crc32.ChecksumIEEE([]byte(listener))))
}

// SetRequestProperty 设置请求属性
func (c *Client) SetRequestProperty(key, value string) {
	v := c.GetRequestProperty(key)
	old := []byte(key + "=" + v + ";")
	new := []byte("")

	c.request.Header = bytes.ReplaceAll(c.request.Header, old, new)
	c.request.Header = append(c.request.Header, []byte(key+"="+value+";")...)
}

// GetRequestProperty 获取请求属性
func (c *Client) GetRequestProperty(key string) string {
	values := strings.Split(string(c.request.Header), ";")
	for _, value := range values {
		kv := strings.Split(value, "=")
		if kv[0] == key {
			return kv[1]
		}
	}

	return ""
}

// GetResponseProperty 获取响应属性
func (c *Client) GetResponseProperty(key string) string {
	values := strings.Split(string(c.response.Header), ";")
	for _, value := range values {
		kv := strings.Split(value, "=")
		if kv[0] == key {
			return kv[1]
		}
	}

	return ""
}

// SetResponseProperty 设置响应属性
func (c *Client) SetResponseProperty(key, value string) {
	v := c.GetResponseProperty(key)
	old := []byte(key + "=" + v + ";")
	new := []byte("")

	c.response.Header = bytes.ReplaceAll(c.response.Header, old, new)
	c.response.Header = append(c.response.Header, []byte(key+"="+value+";")...)
}

// SetRetryInterval 设置断线重连的间隔时间, 单位s
func (c *Client) SetRetryInterval(interval int) {
	c.retryInterval = time.Duration(interval) * time.Second
}

// SetTimeout 设置服务端默认超时时间, 单位s
func (c *Client) SetTimeout(timeout int) {
	c.timeout = time.Duration(timeout) * time.Second
}

// Close 关闭链接
func (c *Client) Close() error {
	c.closed = true
	return c.conn.Close()
}

func (c *Client) connect(server string, port int) {
	var (
		err     error
		address = strings.Join([]string{server, strconv.Itoa(port)}, ":")
	)

	c.conn, err = net.Dial("tcp", address)

	// 检测conn的状态，断线以后进行重连操作
	for {
		if err != nil {
			c.readyState = CLOSED
			if err == io.EOF {
				c.readyStateCallback.OnClose()
			} else {
				c.readyStateCallback.OnError(err.Error())
			}

			// 如果是调用c.Close()方法关闭的则跳过重连机制
			if c.closed {
				return
			}

			time.Sleep(c.retryInterval) // 重连失败以后休息一会再干活
			c.conn, err = net.Dial("tcp", address)
		} else {
			quit := make(chan bool, 1)
			go func(conn net.Conn) {
				err = c.handleConnection(conn)
				if err != nil {
					quit <- true
				}
			}(c.conn)

			c.readyState = OPEN
			c.readyStateCallback.OnOpen()

			<-quit
		}
	}
}
