const ERROR_500_MESSAGE = 'Неизвестная ошибка сервера';

module.exports.errorhandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? ERROR_500_MESSAGE : err.message;
  res
    .status(statusCode)
    .json({ message });
  next();
};
