package wx.sdk.entity.user;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class Authority {
  String name;
}
