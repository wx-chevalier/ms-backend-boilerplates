package codec

import (
	"fmt"
)

type StringCoder struct{}

func (c *StringCoder) Encoder(data interface{}) ([]byte, error) {
	switch t := data.(type) {
	case string:
		return []byte(t), nil
	case *string:
		return []byte(*t), nil
	case []byte:
		return t, nil
	case *[]byte:
		return *t, nil
	default:
		return nil, fmt.Errorf("%T can not be directly converted to []byte", t)
	}
}

func (c *StringCoder) Decoder(data []byte, v interface{}) error {
	switch t := v.(type) {
	case string:
		return fmt.Errorf("expect %T but %T", &t, t)
	case *string:
		*t = string(data)
	case []byte:
		return fmt.Errorf("expect %T but %T", &t, t)
	case *[]byte:
		*t = data
	default:
		return fmt.Errorf("[]byte can not be directly converted to %T", t)
	}

	return nil
}

func init() {
	Register(String, &StringCoder{})
}
