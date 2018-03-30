package wx.wechat.service.pay;

import com.alibaba.fastjson.JSONObject;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;
import lombok.SneakyThrows;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import wx.wechat.service.WXService;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by apple on 16/6/12.
 */

/**
 * @function 用于在购买商品之后进行回调
 */
public class PayedOrderService extends WXService {

    /**
     * @param xml
     * @return
     * @function 解析获取到的XML信息
     * @Test "<xml><appid><![CDATA[wx7d0444df2763bf91]]></appid>\n" +
     * "<bank_type><![CDATA[ICBC_DEBIT]]></bank_type>\n" +
     * "<cash_fee><![CDATA[1]]></cash_fee>\n" +
     * "<device_info><![CDATA[WEB]]></device_info>\n" +
     * "<fee_type><![CDATA[CNY]]></fee_type>\n" +
     * "<is_subscribe><![CDATA[Y]]></is_subscribe>\n" +
     * "<mch_id><![CDATA[1243378802]]></mch_id>\n" +
     * "<nonce_str><![CDATA[0gfe5twrncdh9bvjs5yq]]></nonce_str>\n" +
     * "<openid><![CDATA[ormKXjjvAcg8Dpo_TjKVzrmUFTD8]]></openid>\n" +
     * "<out_trade_no><![CDATA[DB20160612155510337]]></out_trade_no>\n" +
     * "<result_code><![CDATA[SUCCESS]]></result_code>\n" +
     * "<return_code><![CDATA[SUCCESS]]></return_code>\n" +
     * "<sign><![CDATA[4CEA670F1D2865C95BB9F86FBBAAA7ED]]></sign>\n" +
     * "<time_end><![CDATA[20160612155515]]></time_end>\n" +
     * "<total_fee>1</total_fee>\n" +
     * "<trade_type><![CDATA[JSAPI]]></trade_type>\n" +
     * "<transaction_id><![CDATA[4009292001201606127153809026]]></transaction_id>\n" +
     * "</xml>\n";
     */
    @SneakyThrows
    public Map<String, String> parseNotifyXML(String xml) {

        Map<String, String> result = new HashMap<>();

        Document document = DocumentHelper.parseText(xml);

        Element root = document.getRootElement();

        //获取系统内订单编号,这里系统内的订单ID是放在attach内传入
        result.put("attach", root.element("attach").getText());

        //获取微信的订单编号
        result.put("TransactionId", root.element("transaction_id").getText());

        return result;
    }

    /**
     * @param OrderId
     * @param TradeChannel
     * @param TradeType
     * @param TransactionId
     * @function 更新系统内的订单状态
     */
    //
    @SneakyThrows
    public Map<String, Object> updateOrderState(String OrderId, String TradeChannel, String TradeType, String TransactionId) {

        String url = "http://121.40.48.71:8092/api/UpdateOrderState?OrderId=" + OrderId + "&TradeChannel=1&TradeType=1&TransactionId=" + TransactionId;

        //构建请求
        Request request = new Request.Builder()
                .url(url)
                .get()
                .build();

        Map<String, Object> result = new HashMap<>();

        //发起请求
        Response response = new OkHttpClient().newCall(request).execute();

        //解析获取的数据并且返回Map
        JSONObject.parseObject(response.body().string()).forEach((k, v) -> {
            result.put(k, String.valueOf(v));
        });

        return result;

    }



}
