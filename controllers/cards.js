const Card = require("../models/card");
const ERROR_400 = 400;
const ERROR_404 = 404;
const ERROR_500 = 500;
const ERROR_400_MESSAGE =
  "Переданы некорректные данные в методы создания карточки";
const ERROR_404_MESSAGE = "Запрашиваемая карточка не найдена";
const ERROR_500_MESSAGE = "Произошла ошибка";

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_400).send({ message: ERROR_400_MESSAGE });
      } else {
        return res.status(ERROR_500).send({ message: ERROR_500_MESSAGE });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link, likes, createdAt } = req.body;
  Card.create({ name, link, owner: req.user._id, likes, createdAt })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_400).send({ message: ERROR_400_MESSAGE });
      } else {
        return res.status(ERROR_500).send({ message: ERROR_500_MESSAGE });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(ERROR_404).send({ message: ERROR_404_MESSAGE });
      } else {
        return res.status(ERROR_500).send({ message: ERROR_500_MESSAGE });
      }
    });
};

module.exports.putLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { likes: req.user._id },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_400).send({ message: ERROR_400_MESSAGE });
      }
      if (err.name === "CastError") {
        return res.status(ERROR_404).send({ message: ERROR_404_MESSAGE });
      } else {
        return res.status(ERROR_500).send({ message: ERROR_500_MESSAGE });
      }
    });
};

module.exports.deleteLikes = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { likes: "" })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_400).send({ message: ERROR_400_MESSAGE });
      }
      if (err.name === "CastError") {
        return res.status(ERROR_404).send({ message: ERROR_404_MESSAGE });
      } else {
        return res.status(ERROR_500).send({ message: ERROR_500_MESSAGE });
      }
    });
};
