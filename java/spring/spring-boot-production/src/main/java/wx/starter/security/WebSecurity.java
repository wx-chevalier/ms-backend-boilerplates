package wx.starter.security;

import wx.service.user.UserDetailsServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurity extends WebSecurityConfigurerAdapter {

  @Autowired private BCryptPasswordEncoder bCryptPasswordEncoder;

  @Autowired private ObjectMapper objectMapper;

  @Autowired SecurityProperties securityProperties;

  @Autowired private UserDetailsServiceImpl userDetailsService;

  @Override
  protected void configure(HttpSecurity http) throws Exception {

    http.cors()
        .and()
        .csrf()
        .disable()
        .authorizeRequests()
        .antMatchers("/actuator/**")
        .hasRole("ADMIN")
        // permit swagger ui resources
        .antMatchers(
            HttpMethod.GET,
            "/v2/sdk-docs",
            "/swagger-resources/**",
            "/swagger-ui.html**",
            "/webjars/**",
            "favicon.ico")
        .permitAll()
        // permit signup
        .antMatchers(HttpMethod.POST, securityProperties.getPublicUrls().stream().toArray(String[]::new))
        .permitAll()
        .anyRequest()
        .authenticated()
        .and()
        // JWT Authentication & Authorization
        .addFilter(
            new JWTAuthenticationFilter(authenticationManager(), this.securityProperties, objectMapper))
        .addFilter(new JWTAuthorizationFilter(authenticationManager(), this.securityProperties))
        // this disables session creation on Spring Security
        .sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
  }

  @Override
  public void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    if (this.securityProperties.getCors() != null) {
      source.registerCorsConfiguration("/**", this.securityProperties.getCors());
    }
    return source;
  }
}
