package wx.controller;

import wx.config.TokenProvider;
import wx.model.AuthToken;
import wx.model.LoginUser;
import wx.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/token")
public class AuthController {

  @Autowired private AuthenticationManager authenticationManager;

  @Autowired private TokenProvider jwtTokenUtil;

  @Autowired private UserService userService;

  @RequestMapping(value = "/generate-token", method = RequestMethod.POST)
  public ResponseEntity<?> register(@RequestBody LoginUser loginUser)
      throws AuthenticationException {

    final Authentication authentication =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginUser.getUsername(), loginUser.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    final String token = jwtTokenUtil.generateToken(authentication);
    return ResponseEntity.ok(new AuthToken(token));
  }
}
