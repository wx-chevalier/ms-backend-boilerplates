package wx.wechat.common.signature;

import org.xml.sax.SAXException;
import wx.csba.shared.util.codec.MD5;
import wx.csba.shared.util.codec.SHA1;
import wx.wechat.common.Configure;
import wx.wechat.utils.XMLUtils;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;

/**
 * User: rizenguo
 * Date: 2014/10/29
 * Time: 15:23
 */
public class Signature {

    /**
     * @region 以下签名算法用于微信公众号管理
     */
    public static String getSign4MP(Map<String, Object> map) {

        ArrayList<String> list = new ArrayList<String>();
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (entry.getValue() != "") {
                list.add(entry.getKey() + "=" + entry.getValue() + "&");
            }
        }
        int size = list.size();
        String[] arrayToSort = list.toArray(new String[size]);
        Arrays.sort(arrayToSort, String.CASE_INSENSITIVE_ORDER);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < size; i++) {
            sb.append(arrayToSort[i]);
        }
        String result = sb.toString();

        //移除最后一个&
        result = result.substring(0, result.length() - 1);

        result = SHA1.encode(result);

        return result;
    }

    /**
     * @region 以下为用于微信支付的签名计算
     */

    /**
     * 签名算法
     *
     * @param o 要参与签名的数据对象
     * @return 签名
     * @throws IllegalAccessException
     */
//    public static String getSign4Pay(Object o) throws IllegalAccessException {
//        ArrayList<String> list = new ArrayList<String>();
//        Class cls = o.getClass();
//        Field[] fields = cls.getDeclaredFields();
//        for (Field f : fields) {
//            f.setAccessible(true);
//            if (f.get(o) != null && f.get(o) != "") {
//                list.add(f.getName() + "=" + f.get(o) + "&");
//            }
//        }
//        int size = list.size();
//        String[] arrayToSort = list.toArray(new String[size]);
//        Arrays.sort(arrayToSort, String.CASE_INSENSITIVE_ORDER);
//        StringBuilder sb = new StringBuilder();
//        for (int i = 0; i < size; i++) {
//            sb.append(arrayToSort[i]);
//        }
//        String result = sb.toString();
//        result += "key=" + Configure.mchKey;
//        result = MD5.MD5Encode(result).toUpperCase();
//        return result;
//    }

    /**
     * @param map
     * @return
     * @function 从Map中获取签名
     * 假设传送的参数如下：
     * <p>
     * appid： wxd930ea5d5a258f4f
     * <p>
     * mch_id： 10000100
     * <p>
     * device_info： 1000
     * <p>
     * body： test
     * <p>
     * nonce_str： ibuaiVcKdpRxkhJA
     * <p>
     * 第一步：对参数按照key=value的格式，并按照参数名ASCII字典序排序如下：
     * <p>
     * stringA="appid=wxd930ea5d5a258f4f&body=test&device_info=1000&mch_id=10000100&nonce_str=ibuaiVcKdpRxkhJA";
     * <p>
     * 第二步：拼接API密钥：
     * <p>
     * stringSignTemp="stringA&key=192006250b4c09247ec02edce69f6a2d"
     * <p>
     * sign=MD5(stringSignTemp).toUpperCase()="9A0A8659F005D6984697E2CA0A9CF3B7"
     * <p>
     * 最终得到最终发送的数据：
     * <p>
     * <xml>
     * <p>
     * <appid>wxd930ea5d5a258f4f</appid>
     * <p>
     * <mch_id>10000100</mch_id>
     * <p>
     * <device_info>1000<device_info>
     * <p>
     * <body>test</body>
     * <p>
     * <nonce_str>ibuaiVcKdpRxkhJA</nonce_str>
     * <p>
     * <sign>9A0A8659F005D6984697E2CA0A9CF3B7</sign>
     * <p>
     * <xml>
     */
    public static String getSign4Pay(Map<String, Object> map) {
        ArrayList<String> list = new ArrayList<String>();
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (entry.getValue() != "") {
                list.add(entry.getKey() + "=" + entry.getValue() + "&");
            }
        }
        int size = list.size();
        String[] arrayToSort = list.toArray(new String[size]);
        Arrays.sort(arrayToSort, String.CASE_INSENSITIVE_ORDER);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < size; i++) {
            sb.append(arrayToSort[i]);
        }
        String result = sb.toString();
        result += "key=" + Configure.mchKey;
        //Util.log("Sign Before wx.csba.service.util.codec.MD5:" + result);
        result = MD5.MD5Encode(result).toUpperCase();
        //Util.log("Sign Result:" + result);
        return result;
    }

    /**
     * 从API返回的XML数据里面重新计算一次签名
     *
     * @param responseString API返回的XML数据
     * @return 新鲜出炉的签名
     * @throws ParserConfigurationException
     * @throws IOException
     * @throws SAXException
     */
    public static String getSignFromResponseString(String responseString) throws IOException, SAXException, ParserConfigurationException {
        Map<String, Object> map = XMLUtils.XML2Map(responseString);
        //清掉返回数据对象里面的Sign数据（不能把这个数据也加进去进行签名），然后用签名算法进行签名
        map.put("sign", "");
        //将API返回的数据根据用签名算法进行计算新的签名，用来跟API返回的签名进行比较
        return Signature.getSign4Pay(map);
    }

    /**
     * 检验API返回的数据里面的签名是否合法，避免数据在传输的过程中被第三方篡改
     *
     * @param responseString API返回的XML数据字符串
     * @return API签名是否合法
     * @throws ParserConfigurationException
     * @throws IOException
     * @throws SAXException
     */
    public static boolean checkIsSignValidFromResponseString(String responseString) throws ParserConfigurationException, IOException, SAXException {

        Map<String, Object> map = XMLUtils.XML2Map(responseString);

        String signFromAPIResponse = map.get("sign").toString();
        if (signFromAPIResponse == "" || signFromAPIResponse == null) {
            return false;
        }
        //清掉返回数据对象里面的Sign数据（不能把这个数据也加进去进行签名），然后用签名算法进行签名
        map.put("sign", "");
        //将API返回的数据根据用签名算法进行计算新的签名，用来跟API返回的签名进行比较
        String signForAPIResponse = Signature.getSign4Pay(map);

        if (!signForAPIResponse.equals(signFromAPIResponse)) {
            //签名验不过，表示这个API返回的数据有可能已经被篡改了
            return false;
        }
        return true;
    }

}
