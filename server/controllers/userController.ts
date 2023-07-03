import { Request, Response, NextFunction } from "express";
import { AuthRequest, IUser } from "type";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { DuplicateData, WrongCredentials } = require('../middleware/errorHandler');

// Register user
const register = (req: Request, res: Response, next: NextFunction) => {
  // Getting data
  const {
    name, email, password,
  } = req.body;

  // Check if the user already exist or not
  User.exists({ email }).then(async (user: IUser) => {
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
    newUser.save().then((_result: IUser) => {
      res.status(201).json({ message: 'User created' });
    }).catch((error: Error) => {
      next(error);
    });
  }).catch((error: Error) => {
    next(error);
  });
};

// User login
const login = (req: Request, res: Response, next: NextFunction) => {
  // Getting data
  const { email, password } = req.body;

  // If user already registered or not
  User.findOne({ email }).then((user: IUser) => {
    // If their is user in Database
    if (user) {
      // checking password
      bcrypt.compare(password, user.password).then((match: boolean) => {
        if (match) {
          const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
          }, process.env.JWT_TOKEN_SECRET);

          user.save().then((_result) => {
            res.cookie('token', token, {
              httpOnly: true,
              // samesite: 'lax',
              // secure: true,
              path: '/api',
              maxAge: 1000 * 60 * 60 * 24 * 365
            },  );
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
      }).catch((error: Error) => {
        next(error);
      });
    } else {
      throw new WrongCredentials('Wrong credentials');
    }
  }).catch((error: Error) => next(error));
};

// user logout
const logout = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  // clear cookie
  res.clearCookie('token', { path: '/api' });
  res.json({ message: 'Logged Out' })
};

// getUser information
const getUserInfo = (req: AuthRequest, res: Response) => {
    return res.json({
      name: req.user.name,
      email: req.user.email,
      id: req.user.id,
    });
};

module.exports = {
  register,
  login,
  logout,
  getUserInfo,
};
