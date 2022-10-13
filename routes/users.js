const router = require('express').Router();
const {
  getUser,
  getUserId,
  getUserMe,
  patchProfile,
  patchAvatar,
} = require('../controllers/users');

const {
  userValidation,
  userIdValidation,
  avatarValidation,
} = require('../middlewares/validation');

router.get('/', userValidation, getUser);
router.get('/me', getUserMe);
router.get('/:userId', userIdValidation, getUserId);
router.patch('/me', userValidation, patchProfile);
router.patch('/me/avatar', avatarValidation, patchAvatar);

module.exports = router;
