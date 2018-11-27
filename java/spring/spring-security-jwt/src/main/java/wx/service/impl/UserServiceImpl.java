package wx.service.impl;

import wx.dao.UserDAO;
import wx.model.User;
import wx.model.UserDTO;
import wx.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service(value = "userService")
public class UserServiceImpl implements UserDetailsService, UserService {

  @Autowired private UserDAO userDao;

  @Autowired private BCryptPasswordEncoder bcryptEncoder;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userDao.findByUsername(username);
    if (user == null) {
      throw new UsernameNotFoundException("Invalid username or password.");
    }
    return new org.springframework.security.core.userdetails.User(
        user.getUsername(), user.getPassword(), getAuthority(user));
  }

  private Set<SimpleGrantedAuthority> getAuthority(User user) {
    Set<SimpleGrantedAuthority> authorities = new HashSet<>();
    user.getRoles()
        .forEach(
            role -> {
              // authorities.add(new SimpleGrantedAuthority(role.getName()));
              authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));
            });
    return authorities;
    // return Arrays.asList(new SimpleGrantedAuthority("ROLE_ADMIN"));
  }

  @Override
  public List<User> findAll() {
    List<User> list = new ArrayList<>();
    userDao.findAll().iterator().forEachRemaining(list::add);
    return list;
  }

  @Override
  public void delete(long id) {
    userDao.deleteById(id);
  }

  @Override
  public User findOne(String username) {
    return userDao.findByUsername(username);
  }

  @Override
  public User findById(Long id) {
    return userDao.findById(id).get();
  }

  @Override
  public User save(UserDTO user) {
    User newUser = new User();
    newUser.setUsername(user.getUsername());
    newUser.setPassword(bcryptEncoder.encode(user.getPassword()));
    newUser.setAge(user.getAge());
    newUser.setSalary(user.getSalary());
    return userDao.save(newUser);
  }
}
