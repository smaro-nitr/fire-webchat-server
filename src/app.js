const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");

const indexRouter = require("./route/index");

const app = express();
app.use(cors({ credentials: true, origin: "https://fire-webchat.web.app" }));
// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);

module.exports = app;
