package encrypt

import (
	"crypto/md5"
	"encoding/hex"
)

func Md5(src string) string {
	hash := md5.New()
	hash.Write([]byte(src))
	cipher := hash.Sum(nil)
	return hex.EncodeToString(cipher)
}
