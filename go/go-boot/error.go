package go_boot

import (
	"fmt"
	"time"
)

type SystemError struct {
	when time.Time
	file string
	line int
	what string
}

func (e SystemError) Error() string {
	return fmt.Sprintf("[datetime]:%v [file]:%v [line]:%v [message]:%v", e.when, e.file, e.line, e.what)
}
