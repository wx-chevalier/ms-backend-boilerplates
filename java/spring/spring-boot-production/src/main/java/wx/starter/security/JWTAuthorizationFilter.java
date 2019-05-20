package wx.starter.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.List;

import static com.auth0.jwt.algorithms.Algorithm.HMAC512;
import static java.util.stream.Collectors.toList;

@Slf4j
public class JWTAuthorizationFilter extends BasicAuthenticationFilter {

  @Autowired private SecurityProperties securityProperties;

  public JWTAuthorizationFilter(AuthenticationManager authenticationManager, SecurityProperties securityProperties) {
    super(authenticationManager);
    this.securityProperties = securityProperties;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    String header = request.getHeader(this.securityProperties.getJwt().getTokenHeader());
    log.debug(
        "Request authorization header {}: {}",
        this.securityProperties.getJwt().getTokenHeader(),
        header);

    if (header == null || !header.startsWith(this.securityProperties.getJwt().getTokenPrefix())) {
      chain.doFilter(request, response);
      return;
    }

    UsernamePasswordAuthenticationToken authentication = getAuthentication(request);

    SecurityContextHolder.getContext().setAuthentication(authentication);
    chain.doFilter(request, response);
  }

  private UsernamePasswordAuthenticationToken getAuthentication(HttpServletRequest request) {
    String token = request.getHeader(this.securityProperties.getJwt().getTokenHeader());
    if (token != null) {
      log.debug("JWT authorization with {}", token);
      // parse the token.
      DecodedJWT jwt =
          JWT.require(
                  HMAC512(
                      this.securityProperties
                          .getJwt()
                          .getSecret()
                          .getBytes(Charset.forName("UTF-8"))))
              .build()
              .verify(token.substring(this.securityProperties.getJwt().getTokenPrefix().length()));
      String user = jwt.getSubject();

      List<String> authorities =
          jwt.getClaim(this.securityProperties.getJwt().getAuthorityClaim()).asList(String.class);

      if (user != null) {
        return new UsernamePasswordAuthenticationToken(
            user, null, authorities.stream().map(SimpleGrantedAuthority::new).collect(toList()));
      }
    }
    return null;
  }
}
