package wx.starter.security;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "security")
@Data
@PropertySource("classpath:application.yml")
public class SecurityProperties {

  JwtConfig jwt;

  private List<String> publicUrls;

  @Data
  public static class JwtConfig {
    private String secret;
    private String authorityClaim;
    private Long expirationMs;

    private String tokenHeader;
    private String tokenPrefix;
  }

  public CorsConfiguration getCors() {
    return new CorsConfiguration();
  }
}
