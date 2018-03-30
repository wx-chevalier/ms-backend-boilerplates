package wx.wechat.service.mp;

import org.junit.Test;

import java.util.Arrays;

/**
 * Created by apple on 16/6/13.
 */
public class MessageServiceTest {
    @Test
    public void test_generateNewsResponse() {

        String message = "<xml><ToUserName><![CDATA[gh_3e71dcad3d4b]]></ToUserName>\n" +
                "<FromUserName><![CDATA[ormKXjjvAcg8Dpo_TjKVzrmUFTD8]]></FromUserName>\n" +
                "<CreateTime>1465786206</CreateTime>\n" +
                "<MsgType><![CDATA[event]]></MsgType>\n" +
                "<Event><![CDATA[subscribe]]></Event>\n" +
                "<EventKey><![CDATA[last_trade_no_4009292001201606127176139580]]></EventKey>\n" +
                "</xml>\n";

        MessageService messageService = new MessageService(message);

        MessageService.News news = new MessageService.News("title", "description", "picUrl", "url");

        System.out.println(messageService.generateNewsResponse(Arrays.asList(new MessageService.News[]{news})));

    }
}
