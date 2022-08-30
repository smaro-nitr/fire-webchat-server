const firebaseAdmin = require("firebase-admin");

const { authenticate } = require("./authentication.controller");
const { emitterList, eventEmitter } = require("../emitter");
const userDb = require("../model/user.model");

async function allUser(req, res, next) {
  try {
    const db = firebaseAdmin.database();

    const authenticated = await authenticate(db, req.headers.authorization);
    if (!authenticated) {
      eventEmitter.emit(emitterList.signOut, req.headers.authorization);
      return res.status(300).json([]);
    }

    const userList = await userDb.find(
      {},
      { lastLogin: 1, loggedIn: 1, username: 1 }
    );
    return res.status(200).json(userList);
  } catch (err) {
    console.log(err);
    return res.status(400).json("Error");
  }
}
async function activeUser(req, res, next) {
  try {
    const db = firebaseAdmin.database();

    const authenticated = await authenticate(db, req.headers.authorization);
    if (!authenticated) {
      eventEmitter.emit(emitterList.signOut, req.headers.authorization);
      return res.status(300).json([]);
    }

    const activeUser = db.ref("/activeUser");
    await activeUser.once("value", (snapshot) => {
      const value = snapshot.val();
      return res.status(200).json(Object.keys(value));
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json("Error");
  }
}

module.exports = {
  allUser,
  activeUser,
};
