package plugins

import "github.com/wxyyxc1992/go-boot/utils/encrypt"

type Encryption struct{}

func (e *Encryption) Handle(header, body []byte) (h, b []byte) {
	h, err := encrypt.Encrypt(header)
	if err != nil {
		return
	}

	b, err = encrypt.Encrypt(body)
	if err != nil {
		return
	}

	return
}

type Decryption struct{}

func (d *Decryption) Handle(header, body []byte) (h, b []byte) {
	h, err := encrypt.Decrypt(header)
	if err != nil {
		return
	}

	b, err = encrypt.Decrypt(body)
	if err != nil {
		return
	}

	return
}
