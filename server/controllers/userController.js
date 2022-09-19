const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { DuplicateData, WrongCredentials } = require('../middleware/errorHandler');

// Register user
const register = (req, res, next) => {
  // Getting data
  const {
    name, email, password,
  } = req.body;

  // Check if the user already exist or not
  User.exists({ email }).then(async (user) => {
    // if user is already their in Database
    if (user) {
      throw new DuplicateData('User with same email already exist.');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // save newUser
    newUser.save().then((_result) => {
      res.status(201).json({ message: 'User created' });
    }).catch((error) => {
      next(error);
    });
  }).catch((error) => {
    next(error);
  });
};

// User login
const login = (req, res, next) => {
  // Getting data
  const { email, password } = req.body;

  // If user already registered or not
  User.findOne({ email }).then((user) => {
    // If their is user in Database
    if (user) {
      // checking password
      bcrypt.compare(password, user.password).then((match) => {
        if (match) {
          const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
          }, process.env.JWT_TOKEN_SECRET);

          user.token = token;
          user.save().then((_result) => {
            res.cookie('token', token, {
              httpOnly: true,
              // samesite: 'lax',
              // secure: true,
              path: '/api',
            }, { maxAge: 1000 * 60 * 60 * 24 * 365 });
            // send res
            return res.status(200).json({
              name: user.name,
              email: user.email,
              id: user._id,
            });
          }).catch((error) => next(error));
        } else {
          throw new WrongCredentials('Wrong credentials.');
        }
      }).catch((error) => {
        next(error);
      });
    } else {
      throw new WrongCredentials('Wrong credentials');
    }
  }).catch((error) => next(error));
};

// user logout
const logout = (req, res, next) => {
  const { token } = req.cookies;
  // clear cookie
  res.clearCookie('token', { path: '/api' });
  // remove token from Database
  User.updateOne({ token }, {
    token: '',
  }).then((user) => res.json({ message: 'Logged Out' }))
    .catch((error) => next(error));
};

// getUser information
const getUserInfo = (req, res) => {
  if (req.user) {
    return res.json({
      name: req.user.name,
      email: req.user.email,
      id: req.user.id,
    });
  }
  throw new WrongCredentials('Unautharized user.');
};

module.exports = {
  register,
  login,
  logout,
  getUserInfo,
};
