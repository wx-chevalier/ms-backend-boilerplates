package io.wx.sprintboot.test;

import com.alibaba.dubbo.config.annotation.Service;

/**
 * @author xiaofei.wxf(teaey)
 * @since 0.0.0
 */
@Service(version = "1.0.0")
public class EchoServerImpl implements EchoService {

    public String echo(String str) {
        System.out.println(str);
        return str;
    }
}
