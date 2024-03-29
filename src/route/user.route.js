const express = require("express");

const userController = require("../controller/user.controller");

const userRouter = express.Router();

userRouter.get(
  "/",
  (userRouter.allUser = (req, res, next) => {
    userController.allUser(req, res, next);
  })
);
userRouter.get(
  "/active",
  (userRouter.activeUser = (req, res, next) => {
    userController.activeUser(req, res, next);
  })
);

module.exports = userRouter;
