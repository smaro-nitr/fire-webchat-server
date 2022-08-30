const express = require("express");

const chatController = require("../controller/chat.controller");

const chatRouter = express.Router();

chatRouter.get(
  "/:reciever",
  (chatRouter.getMessage = (req, res, next) => {
    chatController.getMessage(req, res, next);
  })
);
chatRouter.post(
  "/send",
  (chatRouter.sendMessage = (req, res, next) => {
    chatController.sendMessage(req, res, next);
  })
);
chatRouter.post(
  "/clear",
  (chatRouter.chatClear = (req, res, next) => {
    chatController.chatClear(req, res, next);
  })
);

module.exports = chatRouter;
