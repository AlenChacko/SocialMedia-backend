const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuthMiddleware");
const {
  addMessage,
  getChat,
  addMessageForRoomId,
  getOneChat,
} = require("../controllers/chatController");

router.post("/addMessageForRoomId", addMessageForRoomId);
router.post("/addMessage", addMessage);
router.get("/messages", userAuth, getChat);
router.get("/getChat/:value", userAuth, getOneChat);

module.exports = router;
