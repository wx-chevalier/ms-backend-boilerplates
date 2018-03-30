package wx.wechat.api;

import org.junit.Before;
import org.junit.Test;
import wx.wechat.api.PayAPI;

/**
 * Created by apple on 16/6/8.
 */
public class PayAPITest {

    PayAPI payAPI;

    @Before
    public void setUp() {

        payAPI = new PayAPI();

    }

    @Test
    public void test_prepay() {

        System.out.println(payAPI.prepay("测试商品", "1415659990", 1, "1", "1"));
    }

}
