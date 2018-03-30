package wx.csba.shared.entity;

import lombok.Data;
import lombok.Getter;

@Data
public class Greeting {

    @Getter
    long counter;

    String message;

    /**
     * @param counter
     * @function 默认构造函数
     */
    public Greeting(long counter, String message) {
        this.counter = counter;
        this.message = message;
    }

}