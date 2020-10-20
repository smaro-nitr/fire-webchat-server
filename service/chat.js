const admin = require("firebase-admin");
const util = require("../util/generalUtil");

const chatService = {};

chatService.signUp = (req, res, next) => {
  const db = admin.database();
  const user = db.ref("/user");

  const { username, password } = req.body;
  user.once("value", function (data) {
    const users = data.val();
    const usersList = users && Object.keys(users);
    let usernameExist = false;
    usersList &&
      usersList.forEach((user) => {
        if (users[user].username === username) usernameExist = true;
      });

    if (usernameExist) {
      res.send({ status: 300, message: "Username Already Taken" });
    } else {
      const lastLogin = util.lastLogin();
      user.child(username).set({
        lastLogin,
        username,
        password,
        loggedIn: true,
      });

      res.send({
        status: 200,
        message: JSON.stringify({
          defaultParam: util.getConstant(),
          lastLogin,
          username,
          loggedIn: true,
        }),
      });
    }
  });
};

chatService.signIn = (req, res, next) => {
  const db = admin.database();
  const user = db.ref("/user");

  const { username, password } = req.body;
  user.once("value", function (data) {
    const users = data.val();
    const usersList = users && Object.keys(users);
    let userExist = false;
    let validUser = false;
    usersList &&
      usersList.forEach((user) => {
        if (users[user].username === username) userExist = true;
        if (userExist && users[user].password === password) validUser = true;
      });

    if (userExist) {
      if (validUser) {
        const lastLogin = util.lastLogin();
        user.child(username).set({
          lastLogin,
          username,
          password,
          loggedIn: true,
        });

        res.send({
          status: 200,
          message: JSON.stringify({
            defaultParam: util.getConstant(),
            lastLogin,
            username,
            loggedIn: true,
          }),
        });
      } else {
        res.send({ status: 300, message: "Login Failed" });
      }
    } else {
      res.send({ status: 300, message: "Who are you ?" });
    }
  });
};

chatService.getUser = (req, res, next) => {
  const db = admin.database();
  const user = db.ref("/user");

  user.once("value", function (data) {
    const userRefinedList = [];

    const users = data.val();
    const usersList = users && Object.keys(users);
    usersList &&
      usersList.forEach((user) => {
        const userRefinedListObj = {};
        userRefinedListObj["lastLogin"] = users[user].lastLogin;
        userRefinedListObj["username"] = users[user].username;
        userRefinedListObj["loggedIn"] = users[user].loggedIn;
        userRefinedList.push(userRefinedListObj);
      });

    res.send({ status: 300, message: userRefinedList });
  });
};

chatService.sendMessage = (req, res, next) => {
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

chatService.chatClear = (req, res, next) => {
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

chatService.signOut = (req, res, next) => {
  const db = admin.database();
  const user = db.ref("/user");

  const { username } = req.body;
  user.once("value", function (data) {
    const users = data.val();
    const usersList = users && Object.keys(users);
    let userExist = null;
    usersList &&
      usersList.forEach((user) => {
        if (users[user].username === username) userExist = users[user];
      });

    if (userExist) {
      userExist.lastLogin = util.lastLogin();
      userExist.loggedIn = false;
      user.child(username).set(userExist);
      res.send({
        status: 200,
        message: "Successfully Sign Out",
      });
    }
  });
};

module.exports = chatService;
