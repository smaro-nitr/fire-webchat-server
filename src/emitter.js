const { EventEmitter } = require("events");

const emitterList = {
  cleanMessage: "clean-message",
  newMessage: "new-message",
  userUpdate: "user-update",
};

const eventEmitter = new EventEmitter();

module.exports = { emitterList, eventEmitter };
