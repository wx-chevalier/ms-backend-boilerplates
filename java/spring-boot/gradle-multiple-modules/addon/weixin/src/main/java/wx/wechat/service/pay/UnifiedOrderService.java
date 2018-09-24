package wx.wechat.service.pay;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NonNull;
import lombok.experimental.Builder;
import wx.wechat.common.Configure;
import wx.csba.shared.util.string.RandomStringGenerator;
import wx.wechat.service.WXService;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by apple on 16/6/7.
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Builder(builderMethodName = "hiddenBuilder")
public class UnifiedOrderService extends WXService {

    /**
     * @region 必填参数
     */
    /**
     * 商品描述,必填
     */
    @NonNull
    private String body;

    /**
     * 商户订单号
     */
    @NonNull
    private String out_trade_no;

    /**
     * 总金额
     */
    @NonNull
    private Integer total_fee;

    /**
     * 终端IP
     */
    @NonNull
    private String spbill_create_ip;

    /**
     * @region 选填参数, Builder模式
     */
    /**
     * 终端设备号(门店号或收银设备ID)，注意：PC网页或公众号内支付请传"WEB"
     */
    private String device_info = "WEB";

    /**
     * 商品详情
     */
    private String detail;

    /**
     * 附加数据
     */
    private String attach;

    /**
     * 货币类型
     */
    private String fee_type;

    /**
     * 交易起始时间
     */
    private String time_start;

    /**
     * 交易结束时间
     */
    private String time_expire;

    /**
     * 交易类型
     */
    private String trade_type = "APP";

    /**
     * 商品ID
     */
    private String product_id;

    /**
     * 指定支付方式
     */
    private String limit_pay;

    /**
     * 用户标识
     */
    private String openid;

    /**
     * @region 公共方法区域
     */

    /**
     * @param body
     * @param out_trade_no
     * @param total_fee
     * @param spbill_create_ip
     * @return
     * @function 复写的Builder方法
     */
    public static UnifiedOrderServiceBuilder builder(String body, String out_trade_no, Integer total_fee, String spbill_create_ip) {
        return hiddenBuilder().body(body).out_trade_no(out_trade_no).total_fee(total_fee).spbill_create_ip(spbill_create_ip);
    }

    /**
     * @return 返回结果
     * @function 发起交易类型为APP的预下单请求, 并且进行必要的参数检查
     */
    public Map<String, Object> appOrder() {

        Map requestData = requestDataGenerator();

        requestData.put("trade_type", "APP");

        //调用请求并且返回参数
        return this.postByXML("https://api.mch.weixin.qq.com/pay/unifiedorder", requestData);
    }

    /**
     * @return
     * @function 利用JSAPI在微信公众号内下单
     * @url
     */
    public Map<String, Object> jsApiOrder(String openid) {

        Map requestData = requestDataGenerator();

        //设置交易类型为JSAPI
        requestData.put("trade_type", "JSAPI");

        //设置当前用户的openid
        requestData.put("openid", openid);

//        System.out.println(requestData);

        //调用请求并且返回参数
        return this.postByXML("https://api.mch.weixin.qq.com/pay/unifiedorder", requestData);
    }

    /**
     * @region 私有方法区域
     */
    /**
     * @return
     * @function 生成公共的请求数据, 包含公共字段
     */
    public Map<String, String> requestDataGenerator() {

        Map<String, String> requestData = new HashMap<>();

        requestData.put("appid", Configure.appID);

        requestData.put("mch_id", Configure.mchID);

        requestData.put("nonce_str", RandomStringGenerator.getRandomStringByLength(20));

        requestData.put("notify_url", Configure.wxpay_notify_url);

        requestData.put("out_trade_no", this.out_trade_no);

        requestData.put("body", body);

        requestData.put("total_fee", total_fee.toString());

        requestData.put("spbill_create_ip", spbill_create_ip);

        requestData.put("trade_type", trade_type);

        requestData.put("device_info", "WEB");

        requestData.put("attach", attach);

        return requestData;
    }

}
