const express = require("express");

const router = express.Router();

router.get("/", function (req, res, next) {
  res.end("Running ServerApi Succesfully");
});
router.use("/chat", require("./chat.route"));
router.use("/login", require("./login.route"));
router.use("/user", require("./user.route"));

module.exports = router;
