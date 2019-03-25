package plugins

import (
	"fmt"

	"github.com/wxyyxc1992/go-boot/utils/encrypt"
)

type Debug struct {
	Sender bool
}

func (d *Debug) Handle(header, body []byte) (h, b []byte) {
	if d.Sender {
		th, _ := encrypt.Decrypt(header)
		tb, _ := encrypt.Decrypt(body)

		fmt.Println("[send packet]", "header:", string(th), "body:", string(tb))
	} else {
		fmt.Println("[receive packet]", "header:", string(header), "body:", string(body))
	}

	return header, body
}
