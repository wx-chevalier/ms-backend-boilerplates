package codec

import (
	"encoding/xml"
)

type XMLCoder struct{}

func (c *XMLCoder) Encoder(data interface{}) ([]byte, error) {
	return xml.Marshal(data)
}

func (c *XMLCoder) Decoder(data []byte, v interface{}) error {
	return xml.Unmarshal(data, v)
}

func init() {
	Register(XML, &JsonCoder{})
}
