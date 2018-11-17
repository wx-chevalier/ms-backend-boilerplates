package wx.controller.common;

import org.springframework.stereotype.Component;
import org.springframework.test.annotation.Commit;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class IndexController {
  @GetMapping("hello")
  public String sayHello() {
    return "Hello World";
  }
}
