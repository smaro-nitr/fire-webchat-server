const { EventEmitter } = require("events");

const emitterList = {
  newSignUp: "new-sign-up",
  newMessage: "new-message",
};

const eventEmitter = new EventEmitter();

module.exports = { emitterList, eventEmitter };
