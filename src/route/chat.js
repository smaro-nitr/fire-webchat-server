const express = require("express");

const chatService = require("../controller/chat");

const userRouter = express.Router();

userRouter.post(
  "/send-message",
  (userRouter.sendMessage = (req, res, next) => {
    chatService.sendMessage(req, res, next);
  })
);
userRouter.post(
  "/remember",
  (userRouter.rememberedUser = (req, res, next) => {
    chatService.rememberedUser(req, res, next);
  })
);
userRouter.post(
  "/clear",
  (userRouter.chatClear = (req, res, next) => {
    chatService.chatClear(req, res, next);
  })
);

module.exports = userRouter;
