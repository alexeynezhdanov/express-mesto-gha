const { isCelebrateError } = require('celebrate');

const ERROR_500_MESSAGE = 'Неизвестная ошибка сервера';

module.exports.errorhandler = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    res
      .status(err.statusCode)
      .json(err);
  } else {
    res
      .status(err.statusCode)
      .json({ message: err.statusCode === 500 ? ERROR_500_MESSAGE : err.message });
  }
  next();
};
