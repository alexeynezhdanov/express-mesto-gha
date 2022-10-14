const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const method = (value, helper) => {
  const result = validator.isURL(value);
  if (result) {
    return helper.message('avatar должно быть валидным url');
  } return value;
};

module.exports.authValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.regValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(method),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
});

module.exports.avatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(method),
  }),
});

module.exports.cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(method),
  }),
});

module.exports.cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
});
