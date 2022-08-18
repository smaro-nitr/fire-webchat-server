const { EventEmitter } = require("events");

const emitterList = {
  newSignUp: "new-sign-up",
};

const eventEmitter = new EventEmitter();

module.exports = { emitterList, eventEmitter };
