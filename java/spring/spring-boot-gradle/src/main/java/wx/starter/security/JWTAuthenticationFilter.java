package wx.starter.security;

import com.auth0.jwt.JWT;
import wx.sdk.entity.user.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static com.auth0.jwt.algorithms.Algorithm.HMAC512;

@Slf4j
public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
  private AuthenticationManager authenticationManager;

  private ObjectMapper objectMapper;

  private SecurityProperties securityProperties;

  public JWTAuthenticationFilter(
      AuthenticationManager authenticationManager,
      SecurityProperties securityProperties,
      ObjectMapper objectMapper) {
    this.authenticationManager = authenticationManager;
    this.objectMapper = objectMapper;
    this.securityProperties = securityProperties;
  }

  /** 解析用户验证信息，发送给 AuthenticationManager */
  @Override
  public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse response)
      throws AuthenticationException {
    try {
      User cred = new ObjectMapper().readValue(req.getInputStream(), User.class);
      return authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(
              cred.getName(), cred.getPassword(), new ArrayList<>()));
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  /** 成功登陆，为用户生成一个 JWT */
  @Override
  protected void successfulAuthentication(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain chain,
      Authentication auth)
      throws IOException, ServletException {

    log.info("Successfully authentication: {}", auth);
    SecurityProperties.JwtConfig jwt = this.securityProperties.getJwt();

    org.springframework.security.core.userdetails.User principal =
        (org.springframework.security.core.userdetails.User) auth.getPrincipal();
    List<String> authorities =
        principal
            .getAuthorities()
            .stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());
    String token =
        JWT.create()
            .withSubject(principal.getUsername())
            .withExpiresAt(new Date(System.currentTimeMillis() + jwt.getExpirationMs()))
            .withArrayClaim(jwt.getAuthorityClaim(), authorities.toArray(new String[] {}))
            .sign(HMAC512(jwt.getSecret()));

    Map<String, String> tokenResult = new HashMap<>();
    tokenResult.put("token", token);
    response.addHeader("Content-Type", "application/json");
    response.addHeader(jwt.getTokenHeader(), jwt.getTokenPrefix() + token);
    response.getWriter().write(objectMapper.writeValueAsString(tokenResult));
  }
}
