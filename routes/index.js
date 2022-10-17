const router = require('express').Router();
const { errors } = require('celebrate');

const {
  login,
  createUser,
} = require('../controllers/users');
const {
  authValidation,
  regValidation,
} = require('../middlewares/validation');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { errorhandler } = require('../middlewares/errorhandler');

router.post('/signin', authValidation, login);
router.post('/signup', regValidation, createUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('/', (req, res, next) => {
  next(new NotFoundError('Такой страницы нет'));
});

router.use(errors());
router.use(errorhandler);

module.exports = router;
