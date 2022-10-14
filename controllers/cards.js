const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/badrequest-err');
const ForbiddenError = require('../errors/forbidden-err');

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
        next(new BadRequestError(ERROR_400_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const ownerId = req.user._id;
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError(`Запрашиваемая карточка c id '${req.params.cardId}' не найдена`))
    .then((card) => {
      if (card) {
        if (card.owner.toString() === ownerId) {
          card.delete()
            .then(() => res
              .status(200)
              .json({ message: `Карточка с id '${req.params.cardId}' успешно удалена` }))
            .catch(next);
        } else { throw new ForbiddenError(ERROR_403_MESSAGE); }
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(`'${req.params.cardId}' не является идентификатором`));
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
        throw new NotFoundError(ERROR_404_MESSAGE);
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(ERROR_400_MESSAGE));
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
        throw new NotFoundError(ERROR_404_MESSAGE);
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(ERROR_400_MESSAGE));
      } else {
        next(err);
      }
    });
};
