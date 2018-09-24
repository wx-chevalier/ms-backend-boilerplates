/**
 * Created by apple on 16/6/7.
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

import Model from "../models/model";

/**
 * @function 用于微信支付类
 */
export default class WXPay extends Model {

    /**
     * @function 默认的微信支付类构造器
     */
    constructor() {

        super();
        //预付费的API
        this.fetchPrepayIdUrl = "/pay/prepay";

    }

    /**
     * @function 从远端获取预付费ID
     * @param body
     * @param out_trade_no
     * @param total_fee
     * @param openid 可选参数
     * @returns {Promise.<TResult>|*} Promise 用于下一步处理
     */
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


    /**
     * @function 同步付款
     * @param appId
     * @param timeStamp
     * @param nonceStr
     * @param package
     * @param signType
     * @param paySign
     */
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


}