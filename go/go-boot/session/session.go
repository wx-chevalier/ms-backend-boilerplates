package session

import (
	"sync"

	"github.com/wxyyxc1992/go-boot"
)

// Session的在线状态
const (
	OFF_LINE  = "off"
	ON_LINE   = "on"
	BUSY_LINE = "busy"
)

var (
	defaultSession = make(map[string]Session)
	mutex          sync.RWMutex
)

type (
	// socket信息、在线状态
	Session struct {
		Status string
		Ctx    linker.Context
		Ext    map[string]interface{}
	}
)

func Get(key string) Session {
	mutex.RLock()
	defer mutex.RUnlock()

	return defaultSession[key]
}

func Set(key string, session Session) {
	mutex.Lock()
	defer mutex.Unlock()

	defaultSession[key] = session
}

func IsExist(key string) bool {
	mutex.RLock()
	defer mutex.RUnlock()

	if _, ok := defaultSession[key]; ok {
		return true
	}

	return false
}

func Delete(key string) {
	mutex.Lock()
	defer mutex.Unlock()
	delete(defaultSession, key)
}

func Default() map[string]Session {
	return defaultSession
}
