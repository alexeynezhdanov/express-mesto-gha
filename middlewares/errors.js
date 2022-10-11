const ServerError = require('../errors/server-err');

const ERROR_500_MESSAGE = 'Произошла ошибка на сервере';

module.exports.errors = (err, req, res, next) => {
  if (err.statusCode) {
    res
      .status(err.statusCode)
      .send({ message: err.message });
  } else {
    res
      .status(ServerError.statusCode)
      .send({ message: ERROR_500_MESSAGE });
  }
  next();
};
