const { EventEmitter } = require("events");

const emitterList = {
  newSignUp: "new-sign-up",
  newMessage: "new-message",
  cleanMessage: "clean-message",
};

const eventEmitter = new EventEmitter();

module.exports = { emitterList, eventEmitter };
