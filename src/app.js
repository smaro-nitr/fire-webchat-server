const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");

const indexRouter = require("./route/index");

const app = express();
if (process.env.NODE_ENV.trim() === "DEV") {
  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
} else {
  app.use(cors({ credentials: true, origin: "https://smaro-webchat.web.app" }));
}
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);

module.exports = app;
