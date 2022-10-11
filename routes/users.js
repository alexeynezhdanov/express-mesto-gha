const router = require('express').Router();
const {
  getUser,
  getUserId,
  getUserMe,
  patchProfile,
  patchAvatar,
  deleteUserId,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/:userId', getUserId);
router.get('/me', getUserMe);
router.patch('/me', patchProfile);
router.patch('/me/avatar', patchAvatar);
router.delete('/:userId', deleteUserId);

module.exports = router;
