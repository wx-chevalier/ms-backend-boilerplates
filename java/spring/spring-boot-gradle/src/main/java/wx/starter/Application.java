package wx.starter;

import wx.repository.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.UUID;

@SpringBootApplication(scanBasePackages = "wx")
@MapperScan(basePackages = "wx")
@Slf4j
public class Application implements CommandLineRunner {
  private UserRepository userRepository;

  public Application(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Bean
  BCryptPasswordEncoder bCryptPasswordEncoder() {
    return new BCryptPasswordEncoder();
  }

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }

  @Override
  public void run(String... args) {
    String adminPass = UUID.randomUUID().toString();
    log.info("admin password: {}", adminPass);
    userRepository.setPassword("admin", bCryptPasswordEncoder().encode(adminPass));
  }
}
