const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');
const DeletionError = require('../errors/deletion-err');

const ERROR_400_MESSAGE = 'Переданы некорректные данные в методы создания карточки';
const ERROR_404_MESSAGE = 'Запрашиваемая карточка не найдена';
const ERROR_403_MESSAGE = 'И не пытайтесь удалить чужую карточку!';

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError(ERROR_400_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(
    req.params.cardId,
    { owner: req.user._id },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError(ERROR_404_MESSAGE));
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DeletionError(ERROR_403_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.putLikes = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError(ERROR_404_MESSAGE));
      } else {
        res.send({ data: card });
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

module.exports.deleteLikes = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError(ERROR_404_MESSAGE));
      } else {
        res.send({ data: card });
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
