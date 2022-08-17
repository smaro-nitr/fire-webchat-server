const admin = require("firebase-admin");

const util = require("../util/generalUtil");

sendMessage = (req, res, next) => {
  const db = admin.database();
  const chat = db.ref("/chat");
  chat.child(Date.now()).set({
    timeStamp: util.timeStamp(),
    sender: req.body.sender,
    reciever: req.body.reciever,
    message: req.body.message,
  });
  res.send({ status: 200, message: "Message Sent Successful" });
};
rememberedUser = (req, res, next) => {
  const db = admin.database();
  const application = db.ref("/application");
  application.child("remember").set(req.body.remember);
  res.send({ status: 200, message: "Remembered Successful" });
};
chatClear = (req, res, next) => {
  const db = admin.database();
  const chat = db.ref("/chat");
  const chatClear = db.ref("/chatClear");
  chatClear.once("value", function (data) {
    const nextTimer = data.val() + 300000;
    chatClear.set(nextTimer);
    chat.set(null);
    res.send({ status: 200, message: "Chat Cleared Successfully" });
  });
};

module.exports = { sendMessage, rememberedUser, chatClear };
