package main

type (
	RequestStatusCallback struct {
		Start   func()
		End     func()
		Success func(header, body []byte)
		Error   func(code int, message string)
	}

	ReadyStateCallback struct {
		Open  func()
		Close func()
		Error func(err string)
	}

	HandlerFunc func(header, body []byte)
)

func (r RequestStatusCallback) OnStart() {
	if r.Start != nil {
		r.Start()
	}
}

func (r RequestStatusCallback) OnSuccess(header, body []byte) {
	if r.Success != nil {
		r.Success(header, body)
	}
}

func (r RequestStatusCallback) OnError(code int, message string) {
	if r.Error != nil {
		r.Error(code, message)
	}
}

func (r RequestStatusCallback) OnEnd() {
	if r.End != nil {
		r.End()
	}
}

// 接口型函数，实现linker.Handler接口
func (f HandlerFunc) Handle(header, body []byte) {
	f(header, body)
}

func (c *ReadyStateCallback) OnOpen() {
	if c.Open != nil {
		c.Open()
	}
}

func (c *ReadyStateCallback) OnClose() {
	if c.Close != nil {
		c.Close()
	}
}

func (c *ReadyStateCallback) OnError(err string) {
	if c.Error != nil {
		c.Error(err)
	}
}
