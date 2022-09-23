const router = require("express").Router();
const {
  getUser,
  getUserId,
  createUser,
  patchProfile,
  patchAvatar,
} = require("../controllers/users");

router.get("/", getUser);
router.get("/:userId", getUserId);
router.post("/", createUser);
router.patch("/me", patchProfile);
router.patch("/me/avatar", patchAvatar);

module.exports = router;
