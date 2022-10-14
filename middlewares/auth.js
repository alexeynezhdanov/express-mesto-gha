const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const ERROR_401_MESSAGE = 'Необходима авторизация';

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(ERROR_401_MESSAGE);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new UnauthorizedError(ERROR_401_MESSAGE));
  }
  req.user = payload;
  next();
};
