const util = {}

const defaultConstant = {
  clearTimeMessage: 'Chat Clean Up Initiated',
  clearTime: 360000,
  signOutTime: 120000
}

util.getConstant = () => {
  return defaultConstant;
}

module.exports = util;