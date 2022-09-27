const User = require("../models/user");

const ERROR_400 = 400;
const ERROR_404 = 404;
const ERROR_500 = 500;
const ERROR_400_MESSAGE =
  "Переданы некорректные данные в методы создания пользователя, профиля или аватара";
const ERROR_404_MESSAGE = "Запрашиваемый пользователь не найден";
const ERROR_500_MESSAGE = "Произошла ошибка";

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_500).send({ message: ERROR_500_MESSAGE }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_404).send({ message: ERROR_404_MESSAGE });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(ERROR_400).send({ message: ERROR_400_MESSAGE });
      } else {
        return res.status(ERROR_500).send({ message: ERROR_500_MESSAGE });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_400).send({ message: ERROR_400_MESSAGE });
      } else {
      return res.status(ERROR_500).send({ message: ERROR_500_MESSAGE });
      }
    });
};

module.exports.patchProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        res.status(ERROR_404).send({ message: ERROR_404_MESSAGE });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(ERROR_400).send({ message: ERROR_400_MESSAGE });
      } else {
      return res.status(ERROR_500).send({ message: ERROR_500_MESSAGE });
      }
    });
};

module.exports.patchAvatar = (req, res) => {
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
        res.status(ERROR_404).send({ message: ERROR_404_MESSAGE });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(ERROR_400).send({ message: ERROR_400_MESSAGE });
      } else {
      return res.status(ERROR_500).send({ message: ERROR_500_MESSAGE });
      }
    });
};
