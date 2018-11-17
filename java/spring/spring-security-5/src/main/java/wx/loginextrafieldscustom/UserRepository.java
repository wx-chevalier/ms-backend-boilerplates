package wx.loginextrafieldscustom;

public interface UserRepository {

    public User findUser(String username, String domain);
    
}
