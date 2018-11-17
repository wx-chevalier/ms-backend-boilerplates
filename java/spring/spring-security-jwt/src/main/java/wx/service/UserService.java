package wx.service;

import wx.model.User;
import wx.model.UserDTO;

import java.util.List;

public interface UserService {

    User save(UserDTO user);
    List<User> findAll();
    void delete(long id);
    User findOne(String username);

    User findById(Long id);
}
