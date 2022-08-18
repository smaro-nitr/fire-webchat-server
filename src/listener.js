const { emitterList, eventEmitter } = require("./emitter");

const socketListener = (socket) => {
  eventEmitter.on(emitterList.newSignUp, (data) => {
    socket.emit(emitterList.newSignUp, data);
  });

  eventEmitter.on(emitterList.newMessage, (data) => {
    socket.emit(emitterList.newMessage, data);
  });

  eventEmitter.on(emitterList.cleanMessage, (data) => {
    socket.emit(emitterList.cleanMessage, data);
  });
};

module.exports = { socketListener };
