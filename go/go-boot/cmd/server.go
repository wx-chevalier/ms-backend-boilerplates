package main

import (
	"fmt"
	"log"
	"time"

	goBoot "github.com/wxyyxc1992/go-boot"
	"github.com/wxyyxc1992/go-boot/plugins"
)

const timeout = 60 * 6 * time.Second

func main() {
	server := goBoot.NewServer(
		goBoot.Config{
			Timeout: timeout,
			PluginForPacketSender: []goBoot.PacketPlugin{
				&plugins.Encryption{},
				&plugins.Debug{Sender: true},
			},
			PluginForPacketReceiver: []goBoot.PacketPlugin{
				&plugins.Decryption{},
				&plugins.Debug{Sender: false},
			},
		})

	router := goBoot.NewRouter()
	router.NSRouter("/v1",
		router.NSRoute(
			"/healthy",
			goBoot.HandlerFunc(func(ctx goBoot.Context) {
				fmt.Println(ctx.GetRequestProperty("sid"))
				ctx.Success(map[string]interface{}{"keepalive": true})
			}),
		),
	)

	server.BindRouter(router)
	log.Fatal(server.RunTCP("tcp", "127.0.0.1:8080"))
}
