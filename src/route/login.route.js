const express = require("express");

const loginService = require("../controller/login.controller");

const loginRouter = express.Router();

loginRouter.post(
  "/sign-up",
  (loginRouter.signUp = (req, res, next) => {
    loginService.signUp(req, res, next);
  })
);
loginRouter.post(
  "/sign-in",
  (loginRouter.signIn = (req, res, next) => {
    loginService.signIn(req, res, next);
  })
);
loginRouter.post(
  "/sign-out",
  (loginRouter.signOut = (req, res, next) => {
    loginService.signOut(req, res, next);
  })
);

module.exports = loginRouter;
