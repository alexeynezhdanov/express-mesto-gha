const router = require('express').Router();
const {
  getCard,
  createCard,
  deleteCard,
  putLikes,
  deleteLikes,
} = require('../controllers/cards');

const {
  cardValidation,
} = require('../middlewares/validation');

router.get('/', getCard);
router.post('/', cardValidation, createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', putLikes);
router.delete('/:cardId/likes', deleteLikes);

module.exports = router;
