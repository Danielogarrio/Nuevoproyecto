const { Strategy } = require('passport-cookie');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

passport.use(
  'current',
  new Strategy(async (cookie, done) => {
    try {
      const token = cookie.token; 
      if (!token) return done(null, false);

      const decoded = jwt.verify(token, 'yourSecretKey');
      const user = await User.findById(decoded.id);
      if (user) return done(null, user);

      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);