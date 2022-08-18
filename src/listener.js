const { emitterList, eventEmitter } = require("./emitter");

const socketListener = (socket) => {
  for (let item in emitterList) {
    eventEmitter.on(emitterList[item], (data) => {
      socket.emit(emitterList[item], data);
    });
  }
};

module.exports = { socketListener };
