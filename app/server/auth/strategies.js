const JwtStrategy = require('passport-jwt').Strategy;
const users = require('./users');

exports.jwt = options => new JwtStrategy(options, ({ id, name, role }, next) => {
  if (!users[role]) {
    return next(new Error('Not supported user role'));
  }

  const user = new users[role](id, name, role);
  return next(null, user);
});
