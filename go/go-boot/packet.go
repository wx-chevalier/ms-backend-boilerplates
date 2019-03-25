package go_boot

import (
	"github.com/wxyyxc1992/go-boot/utils/convert"
)

type (
	Packet struct {
		Operator     uint32
		Sequence     int64
		HeaderLength uint32
		BodyLength   uint32
		Header       []byte
		Body         []byte
	}

	// Packet plugin, for example debug,gzip,encrypt,decrypt
	PacketPlugin interface {
		Handle(header, body []byte) (h, b []byte)
	}
)

func NewPacket(operator uint32, sequence int64, header, body []byte, plugins []PacketPlugin) (Packet, error) {
	for _, plugin := range plugins {
		header, body = plugin.Handle(header, body)
	}

	return Packet{
		Operator:     operator,
		Sequence:     sequence,
		HeaderLength: uint32(len(header)),
		BodyLength:   uint32(len(body)),
		Header:       header,
		Body:         body,
	}, nil
}

// 得到序列化后的Packet
func (p Packet) Bytes() (buf []byte) {
	buf = append(buf, convert.Uint32ToBytes(p.Operator)...)
	buf = append(buf, convert.Int64ToBytes(p.Sequence)...)
	buf = append(buf, convert.Uint32ToBytes(p.HeaderLength)...)
	buf = append(buf, convert.Uint32ToBytes(p.BodyLength)...)
	buf = append(buf, p.Header...)
	buf = append(buf, p.Body...)

	return buf
}
