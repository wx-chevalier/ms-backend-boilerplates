package go_boot

import "time"

// Config for socket server
type Config struct {
	Debug                   bool
	ReadBufferSize          int
	WriteBufferSize         int
	Timeout                 time.Duration
	MaxPayload              uint32
	ContentType             string
	PluginForPacketSender   []PacketPlugin
	PluginForPacketReceiver []PacketPlugin
}
