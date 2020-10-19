const util = {}

const defaultConstant = {
  clearTime: 300000,
  signOutTime: 180000
}

util.getConstant = () => {
  return defaultConstant;
}

util.getNextClear = (currentChatClear) => {
  return  Math.abs(currentChatClear + defaultConstant.clearTime - Date.now())
}

module.exports = util;