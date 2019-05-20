package wx.repository.user;

import wx.sdk.entity.user.Authority;
import wx.sdk.entity.user.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.UUID;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@RunWith(SpringRunner.class)
@ActiveProfiles("test")
@Sql(
        scripts = {
                "classpath:repository/cleanup_users.sql",
                "classpath:repository/test_user_and_authorities.sql"
        })
@MybatisTest
public class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    @Test
    public void test_create_find() {
        String userId = UUID.randomUUID().toString();
        userRepository.save(new User().setId(userId).setName("test_user").setPassword("abc"));
        userRepository.addAuthority(userId, new Authority().setName("ROLE_ADMIN"));
        userRepository.addAuthority(userId, new Authority().setName("USER_CREATE"));
        User admin = userRepository.findByName("test_user", true);
        assertNotNull(admin);
        assertEquals("test_user", admin.getName());
        assertEquals("abc", admin.getPassword());
        assertEquals(2, admin.getAuthorities().size());
    }
}
