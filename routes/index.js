const router = require('express').Router();

const {
  login,
  createUser,
} = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');

const {
  authValidation,
  regValidation,
} = require('../middlewares/validation');

const { auth } = require('../middlewares/auth');

router.post('/signin', authValidation, login);
router.post('/signup', regValidation, createUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('/', (req, res, next) => {
  next(new NotFoundError('Такой страницы нет'));
});

module.exports = router;
