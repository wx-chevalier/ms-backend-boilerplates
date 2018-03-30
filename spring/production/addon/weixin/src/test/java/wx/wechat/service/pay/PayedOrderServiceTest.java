package wx.wechat.service.pay;

import org.junit.Before;
import org.junit.Test;

/**
 * Created by apple on 16/6/13.
 */
public class PayedOrderServiceTest {

    PayedOrderService payedOrderService;

    @Before
    public void setUp() {
        this.payedOrderService = new PayedOrderService();
    }

    @Test
    public void test_parseNotifyXML() {
        String xml = "<xml><appid><![CDATA[wx7d0444df2763bf91]]></appid>\n" +
                "<attach><![CDATA[d0ef6235-fc3b-4287-b689-dd214dea24f0]]></attach>\n" +
                "<bank_type><![CDATA[ICBC_DEBIT]]></bank_type>\n" +
                "<cash_fee><![CDATA[1]]></cash_fee>\n" +
                "<device_info><![CDATA[WEB]]></device_info>\n" +
                "<fee_type><![CDATA[CNY]]></fee_type>\n" +
                "<is_subscribe><![CDATA[Y]]></is_subscribe>\n" +
                "<mch_id><![CDATA[1243378802]]></mch_id>\n" +
                "<nonce_str><![CDATA[n1mlefckpzurtfuais8l]]></nonce_str>\n" +
                "<openid><![CDATA[ormKXjjvAcg8Dpo_TjKVzrmUFTD8]]></openid>\n" +
                "<out_trade_no><![CDATA[DB20160612174435544]]></out_trade_no>\n" +
                "<result_code><![CDATA[SUCCESS]]></result_code>\n" +
                "<return_code><![CDATA[SUCCESS]]></return_code>\n" +
                "<sign><![CDATA[77982C46F5B0D97E18ACBFE93A96B18D]]></sign>\n" +
                "<time_end><![CDATA[20160612174447]]></time_end>\n" +
                "<total_fee>1</total_fee>\n" +
                "<trade_type><![CDATA[JSAPI]]></trade_type>\n" +
                "<transaction_id><![CDATA[4009292001201606127160320932]]></transaction_id>\n" +
                "</xml>\n";

        System.out.println(this.payedOrderService.parseNotifyXML(xml));
    }


    @Test
    public void test_updateOrderState() {
        System.out.println(this.payedOrderService.updateOrderState("9493221f-8701-4fff-8ee9-8320bfea5e72", "1", "1", "10001010101010"));
    }
}
