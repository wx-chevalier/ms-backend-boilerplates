package wx.csba.api.controller;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import wx.csba.shared.entity.Greeting;

@RestController
public class IndexController {

    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    @RequestMapping("/")
    public Greeting greeting(
            @RequestParam(value = "name", defaultValue = "World") String name) {

        return new Greeting(counter.incrementAndGet(), String.format(template, name));
    }
}
