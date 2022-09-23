const router = require("express").Router();
const {
  getCard,
  createCard,
  deleteCard,
  putLikes,
  deleteLikes,
} = require("../controllers/cards");

router.get("/", getCard);
router.post("/", createCard);
router.delete("/:cardId", deleteCard);
router.put("/:cardId/likes", putLikes);
router.delete("/:cardId/likes", deleteLikes);

module.exports = router;
