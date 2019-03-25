package codec

import "encoding/json"

type JsonCoder struct{}

func (c *JsonCoder) Encoder(data interface{}) ([]byte, error) {
	return json.Marshal(data)
}

func (c *JsonCoder) Decoder(data []byte, v interface{}) error {
	return json.Unmarshal(data, v)
}

func init() {
	Register(JSON, &JsonCoder{})
}
