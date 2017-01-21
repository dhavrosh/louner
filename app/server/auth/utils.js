const constructors = require('./users');

exports.allowUserTypes = (...types) => (req, res, next) => {
  const type = types.find(type => constructors.hasOwnProperty(type)
                && req.user.constructor.name === constructors[type].name);
  return type ? next() : next(new Error('Not allowed user for current Route'));
};

exports.checkAuthOfRequest = (req, res, next) => {
     next();
    // if (req.headers['authorization']) {
    //     next();
    // } else {
    //     // res.status(401).json({ msg: 'Not allowed' });
    //    // res.redirect(process.env.COSTNER_API_AUTHENTICATION_URL);
    // }
};
