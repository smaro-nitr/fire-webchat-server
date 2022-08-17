const express = require("express");

const chatController = require("../controller/chat.controller");

const chatRouter = express.Router();

chatRouter.post(
  "/send-message",
  (chatRouter.sendMessage = (req, res, next) => {
    chatController.sendMessage(req, res, next);
  })
);
chatRouter.post(
  "/remember",
  (chatRouter.rememberedUser = (req, res, next) => {
    chatController.rememberedUser(req, res, next);
  })
);
chatRouter.post(
  "/clear",
  (chatRouter.chatClear = (req, res, next) => {
    chatController.chatClear(req, res, next);
  })
);

module.exports = chatRouter;
