package wx.wechat.api;

/**
 * Created by apple on 16/6/8.
 */

import lombok.SneakyThrows;
import wx.wechat.common.Configure;
import wx.csba.shared.util.string.RandomStringGenerator;
import wx.wechat.common.signature.Signature;
import wx.wechat.service.pay.PayedOrderService;
import wx.wechat.service.pay.UnifiedOrderService;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * @function 模拟PrepayAPI的功能
 */
public class PayAPI extends API {

    /**
     * @param body         商品详情
     * @param out_trade_no 商品单号
     * @param total_fee    总价格
     * @param openid       开放的用户ID
     * @return 返回获得的预付款ID
     * @testUrl http://mp.dragon.live-forest.com//pay/prepay?body=报名费用&out_trade_no=1415659990&total_fee=1&openid=ormKXjjvAcg8Dpo_TjKVzrmUFTD8&action=GET
     * @function 用于JSAPI的预先统一下单接口
     */
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
                .builder(body, out_trade_no, total_fee, this.getIp())
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

    /**
     * @param body
     * @return
     * @function 数据回调
     * @xml <xml><appid><![CDATA[wx7d0444df2763bf91]]></appid>
     * <bank_type><![CDATA[ICBC_DEBIT]]></bank_type>
     * <cash_fee><![CDATA[1]]></cash_fee>
     * <device_info><![CDATA[WEB]]></device_info>
     * <fee_type><![CDATA[CNY]]></fee_type>
     * <is_subscribe><![CDATA[Y]]></is_subscribe>
     * <mch_id><![CDATA[1243378802]]></mch_id>
     * <nonce_str><![CDATA[qb7gwyfp9rffb5vtsae0]]></nonce_str>
     * <openid><![CDATA[ormKXjjvAcg8Dpo_TjKVzrmUFTD8]]></openid>
     * <out_trade_no><![CDATA[DB20160612154521157]]></out_trade_no>
     * <result_code><![CDATA[SUCCESS]]></result_code>
     * <return_code><![CDATA[SUCCESS]]></return_code>
     * <sign><![CDATA[8D10A9B97673C1241F1269FE3A26278B]]></sign>
     * <time_end><![CDATA[20160612154526]]></time_end>
     * <total_fee>1</total_fee>
     * <trade_type><![CDATA[JSAPI]]></trade_type>
     * <transaction_id><![CDATA[4009292001201606127153599312]]></transaction_id>
     * </xml>
     */
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

}
