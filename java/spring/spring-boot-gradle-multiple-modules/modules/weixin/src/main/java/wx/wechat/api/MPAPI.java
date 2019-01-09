package wx.wechat.api;

import lombok.Getter;
import wx.wechat.common.Configure;
import wx.csba.shared.util.string.RandomStringGenerator;
import wx.wechat.common.signature.Signature;
import wx.wechat.service.mp.MPService;
import wx.wechat.service.mp.MessageService;
import wx.csba.shared.util.codec.SHA1;

import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by apple on 16/6/10.
 */
public class MPAPI extends API {

    @Getter(lazy = true)
    final private Map<String, String> stateMap = stateMapGenerator();

    /**
     * @param signature 微信加密签名，signature结合了开发者填写的token参数和请求中的timestamp参数、nonce参数。
     * @param timestamp 时间戳
     * @param nonce     随机数
     * @param echostr   随机字符串
     * @return
     * @function 验证消息的确来自微信服务器
     */
//    @RequestMapping(value = "portal", method = {RequestMethod.GET})
    public String portal(
            String signature,
            String timestamp,
            String nonce,
            String echostr) {

        String[] str = {Configure.appToken, timestamp, nonce};

        Arrays.sort(str); // 字典序排序

        String bigStr = str[0] + str[1] + str[2];

        // SHA1加密
        String digest = SHA1.encode(bigStr).toLowerCase();

        // 确认请求来至微信
        if (digest.equals(signature)) {
            return echostr;
        } else {
            return "Invalid Signature";
        }
    }

    /**
     * @param body
     * @return
     * @function 开发者模式, 负责进行消息处理
     */
//    @RequestMapping(value = "portal", method = {RequestMethod.POST})
    public String portal(
            /*@RequestBody(required = false)*/ String body) {

        MessageService messageService = new MessageService(body);

        //目前只返回电子报名状态
        MessageService.News news = new MessageService.News(
                "建筑业“营改增”下造价实操暨合同争议实战培训邀请",
                "建筑业“营改增”后5月1日已经开始实施，江苏省营改增招投标接口5月23日正式使用，参加的讲座一场接一场，一线各岗位进入实操阶段, 您能从容应对吗？是否有如下问题： 营改增下的计价依据、方式、方法怎么选择和操作？对原有造价模式到底有多大冲击？",
                "http://o8jh4kn64.bkt.clouddn.com/%E6%9C%AA%E6%A0%87%E9%A2%98-6.jpg",
                "http://mp.weixin.qq.com/s?__biz=MjM5MjI4NTg3MA==&mid=100000004&idx=1&sn=91cd8dd172f18b73c31e82172fc45099#rd"
        );

        return messageService.generateNewsResponse(Arrays.asList(new MessageService.News[]{news}));
    }

    /**
     * @param body
     * @function 开发者模式, 负责菜单创建
     */
//    @RequestMapping(value = "menu", method = {RequestMethod.POST})
    public boolean menu(/*@RequestBody(required = false)*/ String body) {

        return true;

    }

    /**
     * @param code  回调带入的编码
     * @param state 回调带入的状态
     * @return
     * @function 返回授权之后的用户信息
     * @Test 授权的测试地址
     * https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7d0444df2763bf91&redirect_uri=http%3a%2f%2fmp.dragon.live-forest.com%2fmp%2fauth&response_type=code&scope=snsapi_base&state=eapply
     */
    public /*ModelAndView*/ void auth(
            String code, String state
    ) {

        if (code == null || state == null) {
            //如果传入参数为空,则默认跳转到空页面
//            return new ModelAndView("redirect:" + "http://baidu.com");
        }

        //初始化MPService
        MPService mpService = new MPService();

        /**
         * @Step 1 通过code换取网页授权access_token,注意,这个access_token仅用于用户信息获取与认证
         */
        Map<String, String> accessTokenMap = mpService.fetchAccessTokenByCode4Authorization(code);

        //提取出openid
        String openid = accessTokenMap.get("openid");

        //配置要跳转的URL
        String redirectUrl = this.stateMapGenerator().get(state) + "?openid=" + openid;

        //执行跳转操作
//        return new ModelAndView("redirect:" + redirectUrl);

    }

    /**
     * @param url 本地的URL
     * @return
     * @function 获取JSSDK所需要的配置信息
     */
    public Map<String, Object> jssdk(
            String url
    ) {

        //初始化服务
        MPService mpService = new MPService();

        //首先获取接口调用凭据
        String accessToken = mpService.fetchAccessToken4ClientCredential().get("access_token");

        //根据accessToken获取Ticket
        //从微信服务端获取到Ticket
        String apiTicket = mpService.fetchTicketByAccessToken(accessToken, "jsapi").get("ticket");

        //获取随机字符串
        String nonceStr = RandomStringGenerator.getRandomStringByLength(10);

        //获取当前时间戳
        Long timeStamp = Instant.now().getEpochSecond();

        //进行签名
        Map<String, Object> signatureMap = new HashMap<>();

        signatureMap.put("noncestr", nonceStr);

        signatureMap.put("jsapi_ticket", apiTicket);

        signatureMap.put("timestamp", timeStamp);

        signatureMap.put("url", url);

        signatureMap.put("signature", Signature.getSign4MP(signatureMap));

        return signatureMap;

    }


    /**
     * @return
     * @function 生成State与跳转的网页的配置
     */
    private Map<String, String> stateMapGenerator() {

        Map<String, String> stateMap = new HashMap<>();

        //电子报名页面默认的跳转
        stateMap.put("eapply", "http://mp.dragon.live-forest.com/pay/index.html");

        return stateMap;

    }

}
