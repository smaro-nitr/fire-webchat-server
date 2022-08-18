const { emitterList, eventEmitter } = require("./emitter");

const socketListener = (socket) => {
  eventEmitter.on(emitterList.newSignUp, (data) => {
    socket.emit(emitterList.newSignUp, data);
  });

  eventEmitter.on(emitterList.newMessage, (data) => {
    socket.emit(emitterList.newMessage, data);
  });
};

module.exports = { socketListener };
