const firebaseAdmin = require("firebase-admin");

const { emitterList, eventEmitter } = require("../emitter");
const util = require("../util/generalUtil");

getMessage = (req, res, next) => {
  const db = firebaseAdmin.database();
  const chat = db.ref("/chat");
  chat.once("value", (snapshot) => {
    const value = snapshot.val();
    return res.status(200).json(value ? Object.values(snapshot.val()) : []);
  });
};
sendMessage = (req, res, next) => {
  const db = firebaseAdmin.database();
  const chat = db.ref("/chat");
  const newMessage = {
    timeStamp: util.timeStamp(),
    sender: req.body.sender,
    reciever: req.body.reciever,
    message: req.body.message,
  };
  chat.child(Date.now()).set(newMessage);
  eventEmitter.emit(emitterList.newMessage, [newMessage]);
  return res.send({ status: 200, message: "Message Sent Successful" });
};
chatClear = (req, res, next) => {
  const db = firebaseAdmin.database();
  const chat = db.ref("/chat");
  chat.set(null);
  eventEmitter.emit(emitterList.cleanMessage, []);
  return;
};

module.exports = { getMessage, sendMessage, chatClear };
