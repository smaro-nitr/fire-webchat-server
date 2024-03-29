const nodeCron = require("node-cron");
const firebaseAdmin = require("firebase-admin");
const { createServer } = require("http");
const mongoose = require("mongoose");
const socketIo = require("socket.io");

const app = require("./app");
const { socketListener } = require("./listener");
const { chatClear } = require("./route/chat.route");

// configuration
const PORT = process.env.PORT || 8000;
const MONGO_URL =
  "mongodb+srv://smaro:xnyWdDLPQIVJjyWM@nodejs.9jpq7qd.mongodb.net/nodejs?retryWrites=true&w=majority";
// https://console.firebase.google.com/u/0/project/smaro-webchat/settings/serviceaccounts/adminsdk
const FB_SECRET_KEY = require("../smaro-webchat-firebase-adminsdk-2caep-7262b2043e.json");
const FB_DB_URL =
  "https://smaro-webchat-default-rtdb.asia-southeast1.firebasedatabase.app";

const httpServer = createServer(app);

// socketio connection
const io = socketIo(httpServer, {});
io.on("connection", (socket) => {
  console.log(`SOCKET: ${socket.id} STARTED`);

  socketListener(socket);

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

nodeCron.schedule("0 0 * * *", () => {
  chatClear();
  console.log("chat cleared every day at midnight");
});

// server startup
httpServer.listen(PORT, () => {
  console.log(`PORT: ${PORT}, PID: ${process.pid} STARTED`);
});
