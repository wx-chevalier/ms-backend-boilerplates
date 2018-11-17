package wx.controller.user;

import wx.repository.user.UserRepository;
import wx.sdk.entity.user.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@Sql(
    scripts = {
      "classpath:repository/cleanup_users.sql",
      "classpath:repository/test_user_and_authorities.sql"
    })
@AutoConfigureMockMvc
public class UserResourceTest {
  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;
  @Autowired BCryptPasswordEncoder bCryptPasswordEncoder;
  @Autowired private UserRepository userRepository;

  private String adminPass;

  @Before
  public void setUp() throws Exception {
    adminPass = UUID.randomUUID().toString();
    userRepository.setPassword("admin", bCryptPasswordEncoder.encode(adminPass));
  }

  @Test
  public void test_bCryptPasswordEncoder() {
    String encoded0 = bCryptPasswordEncoder.encode("hello world");
    String encoded1 = "$2a$10$nEbNXJVO2Z2eNigFG0IAI.XaoBQqqAMBdv.pRR1pr0/61qvYljaOy";
    assertTrue(bCryptPasswordEncoder.matches("hello world", encoded0));
    assertTrue(bCryptPasswordEncoder.matches("hello world", encoded1));
  }

  @Test
  public void test_SignUp_Login() throws Exception {
    this.mockMvc
        .perform(
            post("/user/sign-up")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(
                    objectMapper.writeValueAsBytes(
                        new User().setName("test_user").setPassword("test_user"))))
        .andExpect(status().isOk());
    this.mockMvc
        .perform(
            post("/login")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(
                    objectMapper.writeValueAsBytes(
                        new User().setName("test_user").setPassword("test_user"))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("token").exists());
  }

  @Test
  public void test_role_authorization() throws Exception {
    String bearerToken =
        this.mockMvc
            .perform(
                post("/login")
                    .contentType(MediaType.APPLICATION_JSON_UTF8)
                    .content(
                        objectMapper.writeValueAsBytes(
                            new User().setName("admin").setPassword(adminPass))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("token").exists())
            .andReturn()
            .getResponse()
            .getHeader("Authorization");
    this.mockMvc
        .perform(get("/user").header("Authorization", bearerToken))
        .andExpect(status().isOk());
    this.mockMvc
        .perform(get("/user/admin").header("Authorization", bearerToken))
        .andExpect(status().isOk());
  }
}
