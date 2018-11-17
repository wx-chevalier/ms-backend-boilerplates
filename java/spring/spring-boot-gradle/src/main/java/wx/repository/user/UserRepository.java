package wx.repository.user;

import wx.sdk.entity.user.Authority;
import wx.sdk.entity.user.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
@Mapper
public interface UserRepository {
    @Nullable
    User findByName(@Param("name") String name, @Param("withAuthorities") Boolean withAuthorities);

    @NotNull
    Collection<User> findAll();

    void save(@NotNull User user);

    void setPassword(
            @NotNull @Param("name") String name, @NotNull @Param("password") String password);

    void addAuthority(
            @NotNull @Param("userId") String userId, @NotNull @Param("authority") Authority authority);
}
