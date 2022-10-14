const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const UnauthorizedError = require('../errors/unauthorized-err');

const checkURL = /^(https?:\/\/)?[-a-zA-Z0-9@:%_\\+.~#?&\\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\\+.~#?&\\/=]*)?/gi;

const ERROR_401_MESSAGE = 'Неправильные почта или пароль';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return checkURL.test(v);
      },
      message: 'Введите ссылку!',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Введите email!',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(ERROR_401_MESSAGE));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(ERROR_401_MESSAGE));
          }
          return Promise.resolve(user);
        });
    });
};

module.exports = mongoose.model('user', userSchema);
