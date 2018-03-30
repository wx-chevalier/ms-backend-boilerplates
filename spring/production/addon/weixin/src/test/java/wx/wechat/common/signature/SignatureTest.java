package wx.wechat.common.signature;

import org.junit.Assert;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by apple on 16/6/12.
 */
public class SignatureTest {


    @Test
    public void test_getSign4Pay() {
        Map<String, Object> signatureMap = new HashMap<>();

        signatureMap.put("appId","wx7d0444df2763bf91");

        signatureMap.put("timeStamp","1465714382");

        signatureMap.put("package","prepay_id=wx2016061214530221f2e0cf800960917455");

        signatureMap.put("signType","MD5");

        signatureMap.put("nonceStr","919m91s606emwmnsgdzo");

        Signature.getSign4Pay(signatureMap);
    }

    @Test
    public void test_getSign4MP() {

        Map<String, Object> signatureMap = new HashMap<>();

        /**
         * noncestr=Wm3WZYTPz0wzccnW

         jsapi_ticket=sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg

         timestamp=1414587457

         url=http://mp.weixin.qq.com?params=value
         */

        signatureMap.put("noncestr", "Wm3WZYTPz0wzccnW");

        signatureMap.put("jsapi_ticket", "sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg");

        signatureMap.put("timestamp", 1414587457);

        signatureMap.put("url", "http://mp.weixin.qq.com?params=value");

        Assert.assertEquals(Signature.getSign4MP(signatureMap), "0f9de62fce790f9a083d5c99e95740ceb90c27ed");

    }
}
