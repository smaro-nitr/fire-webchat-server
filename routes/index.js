const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.end("Running ServerApi Succesfully");
});

router.use("/", require("./chat"));

module.exports = router;
