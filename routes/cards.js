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
  cardIdValidation,
} = require('../middlewares/validation');

router.get('/', getCard);
router.post('/', cardValidation, createCard);
router.delete('/:cardId', cardIdValidation, deleteCard);
router.put('/:cardId/likes', putLikes);
router.delete('/:cardId/likes', deleteLikes);

module.exports = router;
