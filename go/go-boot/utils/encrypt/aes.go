package encrypt

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
)

// AES是对称加密算法
// AES-128。key长度：16, 24, 32 bytes 对应 AES-128, AES-192, AES-256
// 记住每次加密解密前都要设置iv.

// 该包默认的密匙
const defaultAesKey = "b8ca9aa66def05ff3f24919274bb4a66"

func Encrypt(plaintext []byte) ([]byte, error) {
	key := []byte(defaultAesKey)
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	blockSize := block.BlockSize()
	plaintext = PKCS5Padding(plaintext, blockSize)

	blockMode := cipher.NewCBCEncrypter(block, key[:blockSize])
	ciphertext := make([]byte, len(plaintext))

	blockMode.CryptBlocks(ciphertext, plaintext)
	return ciphertext, nil
}

func Decrypt(ciphertext []byte) ([]byte, error) {
	key := []byte(defaultAesKey)
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	blockSize := block.BlockSize()
	blockMode := cipher.NewCBCDecrypter(block, key[:blockSize])
	plaintext := make([]byte, len(ciphertext))

	blockMode.CryptBlocks(plaintext, ciphertext)
	plaintext = PKCS5UnPadding(plaintext)
	return plaintext, nil
}

func PKCS5Padding(plaintext []byte, blockSize int) []byte {
	padding := blockSize - len(plaintext)%blockSize
	padtext := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(plaintext, padtext...)
}

func PKCS5UnPadding(plaintext []byte) []byte {
	length := len(plaintext)
	// 去掉最后一个字节 unpadding 次
	unpadding := int(plaintext[length-1])
	return plaintext[:(length - unpadding)]
}
