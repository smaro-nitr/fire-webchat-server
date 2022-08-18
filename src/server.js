const firebaseAdmin = require("firebase-admin");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const { createServer } = require("http");

const app = require("./app");
const { emitterList, eventEmitter } = require("./emitter");
const util = require("./util/generalUtil");

// const db = firebaseAdmin.database();
// const chat = db.ref("/chat");
// const user = db.ref("/user");
// const application = db.ref("/application");
// chat.set(null);
// application.child("remember").set("");
// let currentChatClear = Date.now();
// const chatClear = db.ref("/chatClear");
// chatClear.set(currentChatClear);
// const getConstant = util.getConstant();
// setInterval(() => {
//   chat.child(Date.now()).set({
//     timeStamp: "",
//     sender: "",
//     reciever: "",
//     message: getConstant.clearTimeMessage,
//   });
//   setTimeout(() => {
//     const newChatClear = currentChatClear + getConstant.clearTime;
//     chatClear.set(newChatClear);
//     chat.set(null);
//     application.child("remember").set("");
//     currentChatClear = newChatClear;
//   }, getConstant.warningTime);
// }, getConstant.clearTime);

// const server = http.createServer(app);
// const io = socketIO(server);
// let interval;
// io.on("connection", (socket) => {
//   console.log(`socket io ${socket.id} connected`);

//   if (interval) clearInterval(interval);

//   chat.on("child_added", function (snapshot, prevChildKey) {
//     const messageDetail = snapshot.val();
//     socket.emit("message_added", messageDetail);
//   });
//   chat.on("child_removed", function (snapshot, prevChildKey) {
//     const messageDetail = snapshot.val();
//     socket.emit("message_removed", messageDetail);
//   });

//   user.on("child_added", function (snapshot, prevChildKey) {
//     const userDetail = snapshot.val();
//     delete userDetail.password;
//     socket.emit("user_added", userDetail);
//   });
//   user.on("child_changed", function (snapshot, prevChildKey) {
//     const userDetail = snapshot.val();
//     delete userDetail.token;
//     socket.emit("user_updated", userDetail);
//   });

//   application.on("child_changed", function (snapshot, prevChildKey) {
//     const remembered = snapshot.val();
//     socket.emit("user_remembered", remembered);
//   });

//   socket.on("disconnect", () => {
//     console.log(`socket io ${socket.id} disconnected`);
//     clearInterval(interval);
//   });
// });

// configuration
const PORT = process.env.PORT || 8000;
const MONGO_URL =
  "mongodb+srv://smaro:xnyWdDLPQIVJjyWM@nodejs.9jpq7qd.mongodb.net/nodejs?retryWrites=true&w=majority";
const FB_SECRET_KEY = require("../fire-webchat-server-firebase-adminsdk-9izy6-464c7c9250.json");
const FB_DB_URL = "https://fire-webchat-server.firebaseio.com";

const httpServer = createServer(app);

// socketio connection
const io = socketIo(httpServer, {});
io.on("connection", (socket) => {
  console.log(`SOCKET: ${socket.id} STARTED`);

  eventEmitter.on(emitterList.newSignUp, (data) => {
    socket.emit(emitterList.newSignUp, data);
  });

  socket.on("disconnect", () => {
    console.log(`SOCKET: ${socket.id} STOPPED`);
  });
});

// mongodb connection
mongoose.connect(MONGO_URL);
mongoose.connection.on("open", () => {
  console.log("MONGODB CONNECTED");
});
mongoose.connection.on("error", (err) => {
  console.error("MONGODB CONNECTION ERROR");
});

// firebase connection
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(FB_SECRET_KEY),
  databaseURL: FB_DB_URL,
});
firebaseAdmin
  .database()
  .ref(".info/connected")
  .on("value", (snap) => {
    console.log(
      snap.val() === true ? "FIREBASE CONNECTED" : "FIREBASE CONNECTION ERROR"
    );
  });

// server startup
httpServer.listen(PORT, () =>
  console.log(`PORT: ${PORT}, PID: ${process.pid} STARTED`)
);

module.exports = (io) => {
  return (req, res, next) => {
    req.io = io;
    next();
  };
};
