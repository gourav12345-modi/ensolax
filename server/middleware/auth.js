const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const { cookies } = req;
  if (cookies) {
    const { token } = cookies;
    // verify token
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  } else {
    // token is not their
    return res.status(401).json({ message: 'Token not found' });
  }
}

module.exports = auth;
