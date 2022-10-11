const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');

const ERROR_400_MESSAGE = 'Переданы некорректные данные в методы создания пользователя, профиля или аватара';
const ERROR_404_MESSAGE = 'Запрашиваемый пользователь не найден';
const ERROR_401_MESSAGE = 'С вашим токеном что-то не так';

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_404_MESSAGE);
      } else {
        res
          .send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError(ERROR_400_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res
        .send({ token })
        .cookie({ token }, {
          httpOnly: true,
        });
    })
    .catch(() => next(new UnauthorizedError(ERROR_401_MESSAGE)));
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
  } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email: req.body.email,
      password: hash,
    }, { runValidators: true }))
    .then((user) => res
      .send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError(ERROR_400_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.deleteUserId = (req, res, next) => {
  User.findByIdAndRemove(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_404_MESSAGE);
      } else {
        res
          .send(user);
      }
    })
    .catch((err) => next(err));
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.params.user)
    .then((user) => res
      .send({ data: user }))
    .catch((err) => next(err));
};

module.exports.patchProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_404_MESSAGE);
      } else {
        res
          .send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new IncorrectDataError(ERROR_400_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_404_MESSAGE);
      } else {
        res
          .send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new IncorrectDataError(ERROR_400_MESSAGE));
      } else {
        next(err);
      }
    });
};
