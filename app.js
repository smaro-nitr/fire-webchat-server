const admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");
const socketIO = require("socket.io");

const indexRouter = require("./routes/index");
const util = require("./util/generalUtil");
const serviceAccount = require("./fire-webchat-server-firebase-adminsdk-9izy6-464c7c9250.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fire-webchat-server.firebaseio.com",
});
const db = admin.database();
const chat = db.ref("/chat");
const user = db.ref("/user");
const application = db.ref("/application");
chat.set(null);
application.child('remember').set('');
let currentChatClear = Date.now();
const chatClear = db.ref("/chatClear");
chatClear.set(currentChatClear);
const getConstant = util.getConstant();
setInterval(() => {
  chat.child(Date.now()).set({
    timeStamp: "",
    sender: "",
    reciever: "",
    message: getConstant.clearTimeMessage,
  });
  setTimeout(() => {
    const newChatClear = currentChatClear + getConstant.clearTime;
    chatClear.set(newChatClear);
    chat.set(null);
    application.child('remember').set('');
    currentChatClear = newChatClear;
  }, getConstant.warningTime);
}, getConstant.clearTime);

const app = express();
app.use(cors({ credentials: true, origin: "https://fire-webchat.web.app" }));
// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);

const server = require("http").createServer(app);
const io = socketIO(server);
let interval;
io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) clearInterval(interval);

  chat.on("child_added", function (snapshot, prevChildKey) {
    const messageDetail = snapshot.val();
    socket.emit("message_added", messageDetail);
  });
  chat.on("child_removed", function (snapshot, prevChildKey) {
    const messageDetail = snapshot.val();
    socket.emit("message_removed", messageDetail);
  });

  user.on("child_added", function (snapshot, prevChildKey) {
    const userDetail = snapshot.val();
    delete userDetail.password;
    socket.emit("user_added", userDetail);
  });
  user.on("child_changed", function (snapshot, prevChildKey) {
    const userDetail = snapshot.val();
    delete userDetail.password;
    socket.emit("user_updated", userDetail);
  });

  application.on("child_changed", function (snapshot, prevChildKey) {
    const remembered = snapshot.val();
    socket.emit("user_remembered", remembered);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`listening on ${port}`);
});

module.exports = app;
