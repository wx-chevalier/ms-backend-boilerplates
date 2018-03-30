package wx.wechat.service.pay;

import org.junit.Test;

/**
 * Created by apple on 16/6/7.
 */
public class UnifiedOrderServiceTest {

    @Test
    public void test_appData() {

        UnifiedOrderService unifiedOrderService = UnifiedOrderService
                .builder("测试商品", "1415659990", 1, "192.168.0.1")
                .build();

        System.out.println(unifiedOrderService.appOrder());

    }

}
