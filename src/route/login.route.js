const express = require("express");

const loginController = require("../controller/login.controller");

const loginRouter = express.Router();

loginRouter.post(
  "/sign-up",
  (loginRouter.signUp = (req, res, next) => {
    loginController.signUp(req, res, next);
  })
);
loginRouter.post(
  "/sign-in",
  (loginRouter.signIn = (req, res, next) => {
    loginController.signIn(req, res, next);
  })
);
loginRouter.post(
  "/sign-out",
  (loginRouter.signOut = (req, res, next) => {
    loginController.signOut(req, res, next);
  })
);

module.exports = loginRouter;
