package convert

import (
	"testing"
	"time"

	"github.com/wxyyxc1992/go-boot"
)

func TestConvert(t *testing.T) {
	var a uint32 = 199211
	bytes := linker.Uint32ToBytes(a)
	var b uint32 = linker.BytesToUint32(bytes)
	if a != b {
		t.Error("convert error")
	}

	a = 0xffffffff
	b = linker.BytesToUint32(linker.Uint32ToBytes(a))
	if a != b {
		t.Error("convert error")
	}

	var c uint16 = 0xfefe
	bytes2 := linker.Uint16ToBytes(c)
	var d uint16 = linker.BytesToUint16(bytes2)
	if c != d {
		t.Error("convert error")
	}

	c = 65535
	d = linker.BytesToUint16(linker.Uint16ToBytes(c))
	if c != d {
		t.Error("convert error")
	}

	var e int32 = 98765
	bytes3 := linker.Int32ToBytes(e)
	var f int32 = linker.BytesToInt32(bytes3)
	if e != f {
		t.Error("convert error")
	}

	var g int16 = 0x7FFF
	bytes4 := linker.Int16ToBytes(g)
	var h int16 = linker.BytesToInt16(bytes4)
	if g != h {
		t.Error("convert error")
	}

	var i int16 = 32767
	j := linker.BytesToInt16(linker.Int16ToBytes(i))
	if i != j {
		t.Error("convert error")
	}

	var m int64 = time.Now().UnixNano()
	bytes5 := linker.Int64ToBytes(m)
	var n int64 = linker.BytesToInt64(bytes5)
	if m != n {
		t.Error("convert error")
	}
}
