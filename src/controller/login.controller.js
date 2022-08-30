const firebaseAdmin = require("firebase-admin");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

const util = require("../util/generalUtil");
const userDb = require("../model/user.model");
const { emitterList, eventEmitter } = require("../emitter");

async function signUp(req, res, next) {
  try {
    const { username, password } = req.body;
    const token = md5(password);

    if (!username || !password)
      return res.status(300).json("Credential Missing");

    const existingUser = await userDb.find({ username }, { username: 1 });
    if (existingUser.length > 0) return res.status(300).json("User exist");

    const addUser = await userDb({
      lastLogin: util.lastLogin(),
      password: token,
      username,
    });
    addUser.save((err, user) => {
      const addedUser = JSON.parse(JSON.stringify(user));
      delete addedUser.password;
      addedUser.expiry = new Date().getTime() + 1800000;

      const jwtToken = jwt.sign(addedUser, "smaro");

      const db = firebaseAdmin.database();
      const activeUser = db.ref("/activeUser");
      activeUser.child(addedUser.username).set(jwtToken);

      eventEmitter.emit(emitterList.userUpdate, null);

      return res.status(err ? 400 : 200).json(err ? "Unknown error" : jwtToken);
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json("Error");
  }
}
async function signIn(req, res, next) {
  try {
    const { username, password } = req.body;

    const token = md5(password);

    if (!username || !password)
      return res.status(300).json("Credential Missing");

    const existingUser = await userDb.find(
      { username, password: token },
      { username: 1 }
    );
    if (existingUser.length === 0)
      return res.status(300).json("Invalid Credential");

    const updatedUser = await userDb.findOneAndUpdate(
      { username },
      { returnDocument: "after" }
    );
    updatedUser.save((err, user) => {
      const userDetail = JSON.parse(JSON.stringify(user));
      delete userDetail.password;
      userDetail.expiry = new Date().getTime() + 1800000;

      const jwtToken = jwt.sign(userDetail, "smaro");

      const db = firebaseAdmin.database();
      const activeUser = db.ref("/activeUser");
      activeUser.child(userDetail.username).set(jwtToken);

      eventEmitter.emit(emitterList.userUpdate, null);

      return res.status(err ? 400 : 200).json(err ? "Unknown error" : jwtToken);
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json("Error");
  }
}
async function signOut(req, res, next) {
  try {
    const { username } = req.body;
    const { authorization } = req.headers;

    if (!username) return res.status(300).json("Invalid Action");

    const existingUser = await userDb.find({ username }, { username: 1 });
    if (existingUser.length === 0 || existingUser[0].loggedIn === false)
      return res.status(300).json("Invalid Action");

    const updatedUser = await userDb.findOneAndUpdate(
      { username },
      { lastLogin: util.lastLogin() },
      { returnDocument: "after" }
    );
    updatedUser.save((err, user) => {
      const db = firebaseAdmin.database();
      const activeUser = db.ref("/activeUser");
      activeUser.child(username).set(null);

      eventEmitter.emit(emitterList.userUpdate, null);

      return res
        .status(err ? 400 : 200)
        .json(err ? "Unknown error" : authorization);
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json("Error");
  }
}

module.exports = {
  signUp,
  signIn,
  signOut,
};
