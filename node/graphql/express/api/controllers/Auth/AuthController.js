const User = require('../../models/User/User');
const authService = require('../../services/auth.service');
const bcryptService = require('../../services/bcrypt.service');

const AuthController = () => {
  const register = async (req, res) => {
    const {
      email,
      password,
      password2,
    } = req.body;

    if (password === password2) {
      try {
        const user = await User.create({
          email,
          password,
        });
        const token = authService().issue({ id: user.id });

        return res.status(200).json({ token, user });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Passwords don\'t match' });
  };

  const login = async (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
      try {
        const user = await User.findOne({
          where: {
            email,
          },
        });

        if (!user) {
          return res.status(400).json({ msg: 'Bad Request: User not found' });
        }

        if (bcryptService().comparePassword(password, user.password)) {
          const token = authService().issue({ id: user.id });

          return res.status(200).json({ token, user });
        }

        return res.status(401).json({ msg: 'Unauthorized' });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Email and password don\'t match' });
  };

  const validate = (req, res) => {
    const tokenToVerify = req.body.token;

    try {
      const err = authService().verify(tokenToVerify);

      if (err) {
        return res.status(401).json({ isvalid: false, err: 'Unauthorized: Invalid Token' });
      }

      return res.status(200).json({ isvalid: true });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  return {
    register,
    login,
    validate,
  };
};

module.exports = AuthController;
