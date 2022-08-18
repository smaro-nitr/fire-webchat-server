const userDb = require("../model/user.model");

async function allUser(req, res, next) {
  try {
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

module.exports = {
  allUser,
};
