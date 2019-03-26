package go_boot

import (
	"bytes"
	"context"
	"strings"
	"time"

	"github.com/wxyyxc1992/go-boot/utils/codec"
)

type (
	Context interface {
		Set(key string, value interface{})
		Get(key string) interface{}
		MustGet(key string) interface{}
		GetString(key string) (s string)
		GetBool(key string) (b bool)
		GetInt(key string) (i int)
		GetInt64(key string) (i64 int64)
		GetFloat64(key string) (f64 float64)
		GetTime(key string) (t time.Time)
		GetDuration(key string) (d time.Duration)
		GetStringSlice(key string) (ss []string)
		GetStringMap(key string) (sm map[string]interface{})
		ParseParam(data interface{}) error
		Success(body interface{})
		Error(code int, message string)
		Write(operator string, body interface{}) (int, error)
		SetRequestProperty(key, value string)
		GetRequestProperty(key string) string
		SetResponseProperty(key, value string)
		GetResponseProperty(key string) string
		LocalAddr() string
		RemoteAddr() string
	}

	common struct {
		config            Config
		operateType       uint32
		sequence          int64
		body              []byte
		Context           context.Context
		Request, Response struct {
			Header, Body []byte
		}
	}
)

// Set is used to store a new key/value pair exclusively for this context.
func (dc *common) Set(key string, value interface{}) {
	dc.Context = context.WithValue(dc.Context, key, value)
}

// Get returns the value for the given key
func (dc *common) Get(key string) interface{} {
	return dc.Context.Value(key)
}

// Get returns the value for the given key
func (dc *common) MustGet(key string) interface{} {
	v := dc.Context.Value(key)
	if v != nil {
		return v
	}

	panic("Key \"" + key + "\" does not exist")
}

// GetString returns the value associated with the key as a string.
func (dc *common) GetString(key string) (s string) {
	v := dc.Context.Value(key)
	if v != nil {
		s, _ = v.(string)
	}

	return
}

// GetBool returns the value associated with the key as a boolean.
func (dc *common) GetBool(key string) (b bool) {
	v := dc.Context.Value(key)
	if v != nil {
		b, _ = v.(bool)
	}

	return
}

// GetInt returns the value associated with the key as an integer.
func (dc *common) GetInt(key string) (i int) {
	v := dc.Context.Value(key)
	if v != nil {
		i, _ = v.(int)
	}

	return
}

// GetInt64 returns the value associated with the key as an integer.
func (dc *common) GetInt64(key string) (i64 int64) {
	v := dc.Context.Value(key)
	if v != nil {
		i64, _ = v.(int64)
	}

	return
}

// GetFloat64 returns the value associated with the key as a float64.
func (dc *common) GetFloat64(key string) (f64 float64) {
	v := dc.Context.Value(key)
	if v != nil {
		f64, _ = v.(float64)
	}

	return
}

// GetTime returns the value associated with the key as time.
func (dc *common) GetTime(key string) (t time.Time) {
	v := dc.Context.Value(key)
	if v != nil {
		t, _ = v.(time.Time)
	}

	return
}

// GetDuration returns the value associated with the key as a duration.
func (dc *common) GetDuration(key string) (d time.Duration) {
	v := dc.Context.Value(key)
	if v != nil {
		d, _ = v.(time.Duration)
	}

	return
}

// GetStringSlice returns the value associated with the key as a slice of strings.
func (dc *common) GetStringSlice(key string) (ss []string) {
	v := dc.Context.Value(key)
	if v != nil {
		ss, _ = v.([]string)
	}

	return
}

// GetStringMap returns the value associated with the key as a map of interfaces.
func (dc *common) GetStringMap(key string) (sm map[string]interface{}) {
	v := dc.Context.Value(key)
	if v != nil {
		sm, _ = v.(map[string]interface{})
	}

	return
}

func (dc *common) ParseParam(data interface{}) error {
	r, err := codec.NewCoder(dc.config.ContentType)
	if err != nil {
		return err
	}

	return r.Decoder(dc.body, data)
}

func (dc *common) SetRequestProperty(key, value string) {
	v := dc.GetRequestProperty(key)
	if v != "" {
		dc.Request.Header = bytes.Trim(dc.Request.Header, key+"="+value+";")
	}

	dc.Request.Header = append(dc.Request.Header, []byte(key+"="+value+";")...)
}

func (dc *common) GetRequestProperty(key string) string {
	values := strings.Split(string(dc.Request.Header), ";")
	for _, value := range values {
		kv := strings.Split(value, "=")
		if kv[0] == key {
			return kv[1]
		}
	}

	return ""
}

func (dc *common) SetResponseProperty(key, value string) {
	v := dc.GetResponseProperty(key)
	if v != "" {
		dc.Response.Header = bytes.Trim(dc.Response.Header, key+"="+value+";")
	}

	dc.Response.Header = append(dc.Response.Header, []byte(key+"="+value+";")...)
}

func (dc *common) GetResponseProperty(key string) string {
	values := strings.Split(string(dc.Response.Header), ";")
	for _, value := range values {
		kv := strings.Split(value, "=")
		if kv[0] == key {
			return kv[1]
		}
	}

	return ""
}
