package wx.wechat.service.mp;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import wx.wechat.service.WXService;
import wx.wechat.utils.XMLUtils;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * Created by apple on 16/6/13.
 */

/**
 * @function 负责对于消息进行处理
 * @xml 订阅类消息:
 * <xml><ToUserName><![CDATA[gh_3e71dcad3d4b]]></ToUserName>
 * <FromUserName><![CDATA[ormKXjjvAcg8Dpo_TjKVzrmUFTD8]]></FromUserName>
 * <CreateTime>1465786206</CreateTime>
 * <MsgType><![CDATA[event]]></MsgType>
 * <Event><![CDATA[subscribe]]></Event>
 * <EventKey><![CDATA[last_trade_no_4009292001201606127176139580]]></EventKey>
 * </xml>
 */
public class MessageService extends WXService {

    //消息类型
    public static enum MsgType {
        TEXT, //文本类
        EVENT //事件类
    }

    @AllArgsConstructor
    @Data
    public static class News {

        //消息名
        String title;

        //消息描述
        String description;

        //消息图片
        String picUrl;

        //消息链接
        String url;
    }

    //存放XML的文本消息
    String message;

    //消息类型
    MsgType msgType;

    //发送对象
    String toUserName;

    //发送者
    String fromUserName;

    //文本内容
    String content;

    /**
     * @param message 输入的消息类型
     * @function 构造函数
     */
    public MessageService(String message) {

        //将消息转化为Map
        Map<String, Object> messageMap = XMLUtils.XML2Map(message);

        //判断消息类型
        if (messageMap.get("MsgType").equals("event")) {
            this.msgType = MsgType.EVENT;
        } else if (messageMap.get("MsgType").equals("text")) {
            this.msgType = MsgType.TEXT;
        }

        //设置消息发送目标
        this.toUserName = String.valueOf(messageMap.get("ToUserName"));

        //设置消息发送者
        this.fromUserName = String.valueOf(messageMap.get("FromUserName"));

        //设置消息内容
        if (this.msgType.equals(MsgType.TEXT)) {
            this.content = String.valueOf(messageMap.get("Content"));
        }

    }

    /**
     * @param content
     * @return
     * @function 生成最终返回的文本消息
     */
    public String generateTextResponse(String content) {
        return "";
    }

    /**
     * @return
     * @function 生成最终返回的图文消息
     */
    public String generateNewsResponse(List<News> newsList) {

        Element rootElement = this.generateResponse();

        //添加消息类型
        rootElement.addElement("MsgType").addText("news");

        //添加消息数量
        rootElement.addElement("ArticleCount").addText(String.valueOf(newsList.size()));

        //添加文章子项目
        Element articlesElement = rootElement.addElement("Articles");

        //将图文消息依次添加进去
        newsList.forEach(news -> {

            Element itemElement = articlesElement.addElement("item");

            itemElement.addElement("Title").addText(news.getTitle());

            itemElement.addElement("Description").addText(news.getDescription());

            itemElement.addElement("PicUrl").addText(news.getPicUrl());

            itemElement.addElement("Url").addText(news.getUrl());

        });

        return rootElement.asXML();

    }

    private Element generateResponse() {

        Document document = DocumentHelper.createDocument();

        Element root = document.addElement("xml");

        //添加目标
        root.addElement("ToUserName").addText(this.fromUserName);

        //添加发送者
        root.addElement("FromUserName").addText(this.toUserName);

        //添加创建时间
        root.addElement("CreateTime").addText(String.valueOf(Instant.now().getEpochSecond()));


        return root;

    }

}
