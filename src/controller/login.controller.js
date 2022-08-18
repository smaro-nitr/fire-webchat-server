const md5 = require("md5");

const userDb = require("../model/user.model");
const util = require("../util/generalUtil");
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
      loggedIn: true,
      token,
      username,
    });
    addUser.save((err, user) => {
      const addedUser = JSON.parse(JSON.stringify(user));
      delete addedUser.token;
      addedUser.defaultParam = util.getConstant();
      eventEmitter.emit(emitterList.newSignUp, addedUser);
      return res
        .status(err ? 400 : 200)
        .json(err ? "Unknown error" : addedUser);
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
      { username, token },
      { username: 1 }
    );
    if (existingUser.length === 0)
      return res.status(300).json("Invalid Credential");

    const updatedUser = await userDb.findOneAndUpdate(
      { username },
      { loggedIn: true },
      { returnDocument: "after" }
    );
    updatedUser.save((err, user) => {
      const userDetail = JSON.parse(JSON.stringify(user));
      delete userDetail.token;
      userDetail.defaultParam = util.getConstant();
      return res
        .status(err ? 400 : 200)
        .json(err ? "Unknown error" : userDetail);
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json("Error");
  }
}
async function signOut(req, res, next) {
  try {
    const { username } = req.body;

    if (!username) return res.status(300).json("Invalid Action");

    const existingUser = await userDb.find(
      { username },
      { username: 1, loggedIn: 1 }
    );
    if (existingUser.length === 0 || existingUser[0].loggedIn === false)
      return res.status(300).json("Invalid Action");

    const updatedUser = await userDb.findOneAndUpdate(
      { username },
      { loggedIn: false, lastLogin: util.lastLogin() },
      { returnDocument: "after" }
    );
    updatedUser.save((err, user) => {
      const userDetail = JSON.parse(JSON.stringify(user));
      delete userDetail.token;
      userDetail.msg = "Succesfully Logout";
      return res
        .status(err ? 400 : 200)
        .json(err ? "Unknown error" : userDetail);
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
