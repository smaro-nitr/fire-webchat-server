const admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");
const socketIO = require("socket.io");

const indexRouter = require("./routes/index");
const serviceAccount = require("./fire-webchat-server-firebase-adminsdk-9izy6-464c7c9250.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fire-webchat-server.firebaseio.com",
});
const db = admin.database();
const chat = db.ref("/chat");
chat.set(null);
let currentChatClear = Date.now();
const chatClear = db.ref("/chatClear");
chatClear.set(currentChatClear);
setInterval(() => {
  const newChatClear = currentChatClear + 300000;
  chatClear.set(newChatClear);
  chat.set(null);
  currentChatClear = newChatClear;
}, 300000);

const app = express();
app.use(cors({ credentials: true, origin: "https://fire-webchat.web.app" }));
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
    const newPost = snapshot.val();
    socket.emit("child_added", newPost);
  });
  chat.on("child_removed", function (snapshot, prevChildKey) {
    const newPost = snapshot.val();
    socket.emit("child_removed", newPost);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});
const port = process.env.PORT || 8000
server.listen(port, () => {
  console.log(`listening on ${port}`);
})

module.exports = app;
