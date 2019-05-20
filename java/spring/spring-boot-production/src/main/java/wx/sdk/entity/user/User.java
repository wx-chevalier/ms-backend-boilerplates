package wx.sdk.entity.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.Collection;

@Data
@Accessors(chain = true)
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User {
  String id;

  String name;

  String password;

  Boolean expired;

  Boolean locked;

  Collection<Authority> authorities;
}
