package encrypt

import (
	"encoding/base64"
	"fmt"
	"testing"
)

func TestAES(t *testing.T) {
	src := "hello，你好世界"
	encodeBytes, err := Encrypt([]byte(src))
	if err != nil {
		t.Error(err)
	}
	fmt.Println(base64.StdEncoding.EncodeToString(encodeBytes))

	decodeBytes, err := Decrypt(encodeBytes)
	if err != nil {
		t.Error(err)
	}

	if string(decodeBytes) != src {
		t.Error(err)
	}

	fmt.Println(string(decodeBytes))
}
