const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const strategies = require('./strategies');

module.exports = () => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: 'tasmanianDevil',
  };

  passport.use(strategies.jwt(options));

  return {
    initialize: () => passport.initialize(),
    authenticate: (...args) => passport.authenticate(...args),
  };
};
