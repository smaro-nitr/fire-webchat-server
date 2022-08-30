const jwt = require("jsonwebtoken");
const firebaseAdmin = require("firebase-admin");

const { authenticate } = require("./authentication.controller");
const { emitterList, eventEmitter } = require("../emitter");
const util = require("../util/generalUtil");

async function getMessage(req, res, next) {
  try {
    const db = firebaseAdmin.database();

    const authenticated = await authenticate(db, req.headers.authorization);
    if (!authenticated) {
      eventEmitter.emit(emitterList.signOut, req.headers.authorization);
      return res.status(301).json([]);
    }

    const chat = db.ref("/chat");
    chat.once("value", (snapshot) => {
      const value = snapshot.val();
      const decoded = jwt.verify(req.headers.authorization, "smaro");
      const filteredValue =
        value &&
        Object.values(value).filter(
          (item) =>
            [req.params.reciever, decoded.username].includes(item.reciever) &&
            [req.params.reciever, decoded.username].includes(item.sender)
        );
      return res.status(200).json(value ? filteredValue : []);
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json("Error");
  }
}
async function sendMessage(req, res, next) {
  try {
    const db = firebaseAdmin.database();

    const authenticated = await authenticate(db, req.headers.authorization);
    if (!authenticated) {
      eventEmitter.emit(emitterList.signOut, req.headers.authorization);
      return res.status(301).json([]);
    }

    const newMessage = {
      timeStamp: util.timeStamp(),
      sender: req.body.sender,
      reciever: req.body.reciever,
      message: req.body.message,
    };
    const chat = db.ref("/chat");
    chat.child(Date.now()).set(newMessage);

    eventEmitter.emit(emitterList.newMessage, [newMessage]);

    return res.send({ status: 200, message: "Message Sent Successful" });
  } catch (err) {
    console.log(err);
    return res.status(400).json("Error");
  }
}
async function chatClear(req, res, next) {
  try {
    const db = firebaseAdmin.database();
    const chat = db.ref("/chat");
    chat.set(null);
    eventEmitter.emit(emitterList.cleanMessage, []);
    return;
  } catch (err) {
    console.log(err);
    return res.status(400).json("Error");
  }
}

module.exports = { getMessage, sendMessage, chatClear };
