const express = require("express");
const userRouter = express.Router();

const chatService = require("../service/chat");

userRouter.post(
  "/chat-sign-up",
  (userRouter.signUp = (req, res, next) => {
    chatService.signUp(req, res, next);
  })
);

userRouter.post(
  "/chat-sign-in",
  (userRouter.signIn = (req, res, next) => {
    chatService.signIn(req, res, next);
  })
);

userRouter.get(
  "/chat-user",
  (userRouter.getUser = (req, res, next) => {
    chatService.getUser(req, res, next);
  })
);

userRouter.post(
  "/chat-send-message",
  (userRouter.sendMessage = (req, res, next) => {
    chatService.sendMessage(req, res, next);
  })
);

userRouter.post(
  "/chat-clear",
  (userRouter.chatClear = (req, res, next) => {
    chatService.chatClear(req, res, next);
  })
);

userRouter.post(
  "/chat-sign-out",
  (userRouter.signOut = (req, res, next) => {
    chatService.signOut(req, res, next);
  })
);

module.exports = userRouter;
