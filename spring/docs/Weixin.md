<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents** _generated with [DocToc](https://github.com/thlorenz/doctoc)_

- [WXWeChatToolkits](#wxwechattoolkits)
- [公众号管理](#%E5%85%AC%E4%BC%97%E5%8F%B7%E7%AE%A1%E7%90%86)
    - [用户鉴权](#%E7%94%A8%E6%88%B7%E9%89%B4%E6%9D%83)
    - [JSSDK](#jssdk)
- [微信支付](#%E5%BE%AE%E4%BF%A1%E6%94%AF%E4%BB%98)
    - [统一下单获取预支付代码](#%E7%BB%9F%E4%B8%80%E4%B8%8B%E5%8D%95%E8%8E%B7%E5%8F%96%E9%A2%84%E6%94%AF%E4%BB%98%E4%BB%A3%E7%A0%81)
    - [微信内 H5 支付](#%E5%BE%AE%E4%BF%A1%E5%86%85-h5-%E6%94%AF%E4%BB%98)
    - [支付结果回调](#%E6%94%AF%E4%BB%98%E7%BB%93%E6%9E%9C%E5%9B%9E%E8%B0%83)
- [WebUI:页面呈现于效果实现](#webui%E9%A1%B5%E9%9D%A2%E5%91%88%E7%8E%B0%E4%BA%8E%E6%95%88%E6%9E%9C%E5%AE%9E%E7%8E%B0)
    - [Boilerplate:基本页面模板](#boilerplate%E5%9F%BA%E6%9C%AC%E9%A1%B5%E9%9D%A2%E6%A8%A1%E6%9D%BF)
        - [提示跳转到浏览器打开](#%E6%8F%90%E7%A4%BA%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%B5%8F%E8%A7%88%E5%99%A8%E6%89%93%E5%BC%80)
        - [防止下拉"露底"](#%E9%98%B2%E6%AD%A2%E4%B8%8B%E6%8B%89%E9%9C%B2%E5%BA%95)
    - [Scroll Animation:滚动效果](#scroll-animation%E6%BB%9A%E5%8A%A8%E6%95%88%E6%9E%9C)
- [JSSDK:其他 JSSDK 常用操作](#jssdk%E5%85%B6%E4%BB%96-jssdk-%E5%B8%B8%E7%94%A8%E6%93%8D%E4%BD%9C)
    - [Share:分享](#share%E5%88%86%E4%BA%AB)
        - [不使用额外 API 设置分享的标题、图片与链接](#%E4%B8%8D%E4%BD%BF%E7%94%A8%E9%A2%9D%E5%A4%96-api-%E8%AE%BE%E7%BD%AE%E5%88%86%E4%BA%AB%E7%9A%84%E6%A0%87%E9%A2%98%E3%80%81%E5%9B%BE%E7%89%87%E4%B8%8E%E9%93%BE%E6%8E%A5)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# WXWeChatToolkits

我的微信 SDK，包括公众平台管理、微信支付等各个版本。老实说,微信的文档并不是很友好,坑不少啊~~ 笔者在这里准备的算是半自动化的,自认为的特性有:

* 前后端分离,这里的 JS 代码和后端代码是可以单独部署的。换言之,微信里需要的各种各样的域名配置与审核,你只要保证你的 HTML 页面在那个域名下就好,业务逻辑的代码随便放
* 后端这边笔者自己开发时候用的是 Spring Boot,但是这里移除了所有 Spring Boot 的紧密耦合代码,只是用 Pure Java API 进行实现,也方便单元测试
* 前端这边用的是 ES6 + Webpack,可以参考笔者其他前端项目

下面就大概描述下开发流程和可以用到的本代码集的东东,半成品,权当一乐。

# 公众号管理

## 用户鉴权

用户鉴权首先需要检测是否进行认证跳转:

```
WXService wxService = new WXService();


//判断是否为微信系统内
if (wxService.isWeixinBrowser()) {

    //如果是在微信浏览器内判断是否需要进行登录操作
    const openid = wxService.getOpenidOrRedirectToAuth("eapply");

    if (!openid) {
        //如果openid不存在,则提示错误,并且跳转登录授权
        message.info("未登录,现进行登录授权!");
    } else {
        //执行JSSDK的注册
        wxService.jssdkConfig();
    }

}
```

这里的跳转大概是这样的路径:

```
const auth_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appid}&response_type=code&scope=snsapi_base&state=${state}&redirect_uri=${this.redirect_uri}#wechat_redirect`
```

注意,一开始笔者自己是想将回调之后的跳转路径放到 State 里面的,但是微信好像对 State 做了限制,因此在这里只是配置了一个标识,而具体的标识与跳转地址映射写到了后台代码里:

```MPAPI
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
```

## JSSDK

微信的官方文档里提到,要申请 JSSDK 要先去获取 jsapi_ticket,而 jsapi_ticket 需要用 access_token 换取。要注意,微信的 access_token 是分类型的,上面用户鉴权也用到了 access_token,不过那个的类型是 authentic。这里的 access_token 类型是 jsapi。配置的前端代码是:

```
jssdkConfig() {

        //插入JSSDK脚本
        // load a single file
        loadjs('http://res.wx.qq.com/open/js/jweixin-1.0.0.js', () => {
            // foo.js loaded'//从URL中获取JSSDK信息

            //访问远端获取JSSDK配置信息
            this.getWithQueryParams({
                path: "/mp/jssdk",
                requestData: {
                    url: location.href
                }
            }).then((jssdk)=> {

                console.log(jssdk);

                //配置JSSDK
                wx.config({

                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。

                    appId: this.appid, // 必填，公众号的唯一标识

                    timestamp: jssdk.timestamp, // 必填，生成签名的时间戳

                    nonceStr: jssdk.noncestr, // 必填，生成签名的随机串

                    signature: jssdk.signature,// 必填，签名，见附录1

                    jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2

                });

                //监控错误信息
                wx.error(function (res) {

                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                    alert(JSON.stringify(res));
                });

            });


        });


    }
```

后端代码是:

```
        //初始化服务
        MPService mpService = new MPService();

        //首先获取接口调用凭据
        String accessToken = mpService.fetchAccessToken4ClientCredential().get("access_token");

        //根据accessToken获取Ticket
        //从微信服务端获取到Ticket
        String apiTicket = mpService.fetchTicketByAccessToken(accessToken, "jsapi").get("ticket");

        //获取随机字符串
        String nonceStr = StringGenerator.getRandomString(10);

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
```

# 微信支付

注意，微信支付内也需要签名，但是签名的算法以及所需要的 Key 与公众号管理内还是有一定区别的。

## 统一下单获取预支付代码

前端代码:

```
    fetchPrepayId({
        body = "商品详情",
        out_trade_no = "1415659990",
        total_fee = 1,
        openid = undefined,
        attach //附加信息
    }) {

        if (openid) {
            //如果存在openid,则是以JSAPI方式调用
            return this.getWithQueryParams({
                path: this.fetchPrepayIdUrl,
                requestData: {
                    body,
                    out_trade_no,
                    total_fee,
                    openid,
                    attach
                }
            });
        } else {
            //否则是以APP方式调用
            return this.getWithQueryParams({
                path: this.fetchPrepayIdUrl,
                requestData: {
                    body,
                    out_trade_no,
                    total_fee,
                    attach
                }
            });

        }


    }
```

后端代码:

```
    @SneakyThrows
    public Map<String, Object> prepay(
            String body,
            String out_trade_no,
            Integer total_fee,
            String openid,
            String attach) {

        //最终返回的结果
        Map<String, Object> result = new HashMap<>();

        //调用统一下单服务
        UnifiedOrderService unifiedOrderService = UnifiedOrderService
                .builder(body, out_trade_no, total_fee, getIp("127.0.0.1"))
                .attach(attach)
                .build();

        //获取的返回的同一订单信息
        Map<String, Object> unidiedOrder;

        //判断openid是否存在
        if (openid != null) {
            //如果opendid存在,则创建JSAPI Order
            unidiedOrder = unifiedOrderService.jsApiOrder(openid);
        } else {
            unidiedOrder = unifiedOrderService.appOrder();
        }

//        System.out.println(unidiedOrder);

        /* 最终客户端要提交给微信服务器的订单,因此我们也要将关键信息加进去
        "appId" : "wx2421b1c4370ec43b",     //公众号名称，由商户传入
        "timeStamp":" 1395712654",         //时间戳，自1970年以来的秒数
        "nonceStr" : "e61463f8efa94090b1f366cccfbbb444", //随机串
        "package" : "prepay_id=u802345jgfjsdfgsdg888",
        "signType" : "MD5",         //微信签名方式:
        "paySign" : "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名
        */

        //获取随机字符串
        String nonceStr = RandomStringGenerator.getRandomStringByLength(20);


        //返回商户对应的AppID
        result.put("appId", Configure.appID);

        result.put("timeStamp", Instant.now().getEpochSecond());

        result.put("nonceStr", nonceStr);

        result.put("package", "prepay_id=" + unidiedOrder.get("prepay_id"));

        result.put("signType", "MD5");

        result.put("paySign", Signature.getSign4Pay(result));

        //直接返回
        return result;
    }
```

## 微信内 H5 支付

```
    doSyncPay({
        appId="wx7d0444df2763bf91",
        timeStamp="1465698294",
        nonceStr="2g1w8kvb5lamqwfx6j8o",
        package_r="prepay_id=wx2016061210245447b57ae3b30364645260",
        signType="MD5",
        paySign="01B98B973451A1AA83EC062F2F46AB75"
    }, cb) {

        //调用微信支付的接口
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": appId,
                "timeStamp": timeStamp,
                "nonceStr": nonceStr,
                "package": package_r,
                "signType": signType,
                "paySign": paySign
            },
            function (res) {

                //打印支付信息
                console.log(res);

                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    //支付成功
                    cb(res);

                } else {

                    // alert(JSON.stringify(res));

                    alert("您取消了支付!");
                }
            }
        )
        ;
    }
```

## 支付结果回调

```
   public String wx_notify(String body) {

//        System.out.println(body);

        PayedOrderService payedOrderService = new PayedOrderService();

        //解析数据
        Map<String, String> parsedMap = payedOrderService.parseNotifyXML(body);

        System.out.println(parsedMap);

        //调用更新状态的函数
        payedOrderService.updateOrderState(parsedMap.get("attach"), "1", "1", parsedMap.get("TransactionId"));

        return "success";
    }
```

# WebUI:页面呈现于效果实现

## Boilerplate:基本页面模板

### 提示跳转到浏览器打开

微信内页面对于链接跳转、应用下载等做了很多的限制，因此很多时候我们需要提示用户在右上角选择到浏览器中打开，基本效果如下图所示：

* iOS

![](http://dearb.u.qiniudn.com/QQ20131107164807.jpg)

* Android

![](http://d.16css.com/d/file/piaofu/201504/58ae7db94d79dca847d697559b1e38be.png)

笔者在这里对二者的代码做了总结和调整，最后的代码为：

* HTML

```
<div id='popweixin'>
    <div class='tip top2bottom animate-delay-1'>
        <div class="android" id="popweixin-android">
        </div>
        <div class="ios" id="popweixin-ios">
            <span>如果无法点击下载,请点击右上角跳转按钮,选择"在Safari中打开"~</span>
            <img src="http://7xiegq.com1.z0.glb.clouddn.com/weixin-tips-ios.png" alt="">
        </div>
    </div>
</div>
```

* Style

```
<style>
    #popweixin {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: fixed;
        z-index: 1000;
        background: rgba(0, 0, 0, .5);
        top: 0;
        left: 0;
        display: none;
        z-index: 999999;
    }

    #popweixin .tip {
        height: 50%;
        width: 100%;
        background: none;
        z-index: 1001;
    }

    .top2bottom {
        -webkit-animation: top2bottom 1.2s ease;
        -moz-animation: top2bottom 1.2s ease;
        -o-animation: top2bottom 1.2s ease;
        animation: top2bottom 1.2s ease;
        -webkit-animation-fill-mode: backwards;
        -moz-animation-fill-mode: backwards;
        -o-animation-fill-mode: backwards;
        animation-fill-mode: backwards
    }

    .animate-delay-1 {
        -webkit-animation-delay: 1s;
        -moz-animation-delay: 1s;
        -o-animation-delay: 1s;
        animation-delay: 1s
    }

    @-webkit-keyframes top2bottom {
        0% {
            -webkit-transform: translateY(-300px);
            opacity: .6
        }
        100% {
            -webkit-transform: translateY(0px);
            opacity: 1
        }
    }

    @keyframes top2bottom {
        0% {
            transform: translateY(-300px);
            opacity: .6
        }
        100% {
            transform: translateY(0px);
            opacity: 1
        }
    }

    #popweixin .tip .android {
        height: 100%;
        background: url("http://demo.16css.com/piaofu/906/live_weixin.png");
        background-size: 100% 100%;
        padding: 5px;
        top: 10px;
        display: none;
    }

    #popweixin .tip .ios {
        height: 100%;
        margin-top: 10%;
        padding: 5%;
    }

    #popweixin .tip .ios span {
        float: left;
        color: white;
        font-size: 25px;
        line-height: 50px;
        width: 65%;
    }

    #popweixin .tip .ios img {
        float: right;
        height: 45%;
        width: 30%;
    }

</style>
```

* Script

```
<script>
    //判断浏览器类型
    var ua = navigator.userAgent.toLowerCase();

    if (ua.match(/MicroMessenger/i) == "micromessenger") {

        //如果是微信浏览器,则设置弹出层显示
        document.getElementById("popweixin").style.display = "block";

        if (/iphone|ipod/.test(ua)) {

            //iOS微信
            document.getElementById("popweixin-ios").style.display = "block";

        } else {

            // Android微信版本
            document.getElementById("popweixin-android").style.display = "block";

        }


    }

</script>
```

### 防止下拉"露底"

在微信中，随便打开一个 H5 页面，用力往下扯的时候，页面上方会出现“黑底”，黑底上有一行诸如`网页由game.weixin.qq.com提供`的文字，有时候会很难看啊，如果需要避免这种下拉露底，一般来说有几种方式：

（1）直接使用 iScroll 或者 niceScroll 托管滚动事件。

（2）判断下拉

可以参考类库[preventoverscrolljs](https://github.com/yuanzm/preventoverscrolljs)，引用组件支持下面两种方式：

* clone 之后直接拷贝引用`bin`文件夹下面的`preventoverscroll.min.js`
* 从 npm 下载安装
  * `npm install --save preventoverscrolljs`
  * var PreventOverScroll = require('preventoverscrolljs');

然后页面布局上设置一个包裹层：

```
<body id="wrapper">
    <div id="container"></div>
</body>
```

样式要写成这个样子：

```
html, body {
  width: 100%;
  height: 100%;
}
#container {
	height: 100%;
}
```

最后实例化组件：

```
var list = ['container'];
var prevent = new PreventOverScroll({
    list: list
});
```

有时候还需要对 Android 或者 iOS 做一个区分：

```
var outer = (  isAndroid // do it yourself
             ? 'wrapper'
             : 'container' );
var list = [outer];
var prevent = new PreventOverScroll({
    list: list
});
```

## Scroll Animation:滚动效果

# JSSDK:其他 JSSDK 常用操作

## Share:分享

### 不使用额外 API 设置分享的标题、图片与链接

> [原文地址](https://github.com/navyxie/weixin_js)

微信在 6.0.2 及以上版本已经回收客户端自定分享的权限，而是以授权 api 的形式开放出来。有时候我们只想简单地自定义分享的 title,分享的图片以及分享的链接时，而不想或者缺乏资源去接入微信 api 的时候该怎么实现呢？

1.设置分享 title:动态改变 document.title 值即可:

```
document.title = 'test'
```

2.设置分享图片：在页面隐藏一张尺寸大于 290\*290 的图（图片需要容器包裹，设置容器 css 属性 display:none 即可）:

```
<div style="display:none"><img src="share.jpg" /></div>
```

3.设置分享的链接：动态修改 document.documentURI 的值即可（safari 下，document.documentURI 为只读属性，可借助 history.pushState ）

```
//android:
document.documentURI = "http://www.navyxie.com"；//经测试wechat6.3.13版本下此方法已失效，可使用同下IOS的方法自定义。
//ios:
window.history.pushState("weixin-share-url", "weixinshare", "http://www.navyxie.com");//只可设置同域链接
```

以上方法即可在微信 6.0.2+版本自定义分享内容，不需额外引入微信的 js 文件
