package wx.wechat.service.mp;

import wx.wechat.common.Configure;
import wx.wechat.service.WXService;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by apple on 16/6/9.
 */
public class MPService extends WXService {

    /**
     * @return
     * @function 获取接口调用凭据 Access_Token
     */
    public Map<String, String> fetchAccessToken4ClientCredential() {

        //路径
        final String path = "/cgi-bin/token";

        Map<String, String> params = new HashMap<>();

        params.put("appid", Configure.appID);

        params.put("secret", Configure.appSecret);

        params.put("grant_type", "client_credential");

        //调用远程获取的函数
        Map<String, String> result = this.getWithParams(this.API_WEIXIN_HOST, path, params);

//        System.out.println(result);

        return result;
    }

    /**
     * @return
     * @function 从远端获取到Access Token,注意,该AccessToken用于用户认证
     */
    public Map<String, String> fetchAccessTokenByCode4Authorization(String code) {

        //路径
        final String path = "/sns/oauth2/access_token";

        Map<String, String> params = new HashMap<>();

        params.put("appid", Configure.appID);

        params.put("secret", Configure.appSecret);

        params.put("code", code);

        params.put("grant_type", "authorization_code");

        //调用远程获取的函数
        Map<String, String> result = this.getWithParams(this.API_WEIXIN_HOST, path, params);

//        System.out.println(result);

        return result;
    }

    /**
     * @param accessToken
     * @return {
     * <p>
     * "errcode":0,
     * <p>
     * "errmsg":"ok",
     * <p>
     * "ticket":"bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA",
     * <p>
     * "expires_in":7200
     * <p>
     * }
     * @function 根据AccessToken获取JSAPI_TICKET
     * @url https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi
     */
    public Map<String, String> fetchTicketByAccessToken(String accessToken, String type) {

        //请求路径
        final String path = "/cgi-bin/ticket/getticket";

        Map<String, String> params = new HashMap<>();

        params.put("access_token", accessToken);

        params.put("type", type);

        Map<String, String> result = this.getWithParams(this.API_WEIXIN_HOST, path, params);

//        System.out.println(result);

        return result;

    }

}
