/**
 * Created by apple on 16/6/10.
 */
import Model from "../models/model";
var loadjs = require('loadjs');
/**
 * @function 默认的微信工具类
 */
export default class WXService extends Model {

    constructor() {

        super();

        this.appid = "wx7d0444df2763bf91";

        //OAuth时候填入的跳转地址,注意要进行URL编码
        this.redirect_uri = "http%3a%2f%2fmp.dragon.live-forest.com%2fmp%2fauth";

        this.storageKey = {
            openid: "wechat_openid"
        }
    }

    /**
     * @function 判断当前是否在微信内
     * @returns {boolean} true 微信内 false 其他浏览器或者运行环境
     */
    isWeixinBrowser() {
        return /micromessenger/.test(navigator.userAgent.toLowerCase())
    }

    /**
     * @function 获取用户的openid或者根据state进行跳转
     * @param state
     * @returns {*}
     */
    getOpenidOrRedirectToAuth(state) {

        //首先从URL中获取
        if (this.getParameterByName("openid")) {

            //将从URL中获取的openid存入到localStorage中
            localStorage.setItem(this.storageKey.openid, this.getParameterByName("openid"));

            //如果URL中存在着openid
            return this.getParameterByName("openid");
        }

        //否则从本地的localStorage中获取
        if (localStorage.getItem(this.storageKey.openid)) {
            //如果本地localStorage存在openid,则直接返回
            return localStorage.getItem(this.storageKey.openid);
        }

        //否则执行跳转
        const auth_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appid}&response_type=code&scope=snsapi_base&state=${state}&redirect_uri=${this.redirect_uri}#wechat_redirect`

        //进行跳转
        location.href = auth_url;
    }

    /**
     * @function 配置本地的JSSDK
     */
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

}