const util = {}

const defaultConstant = {
  clearTimeMessage: 'Chat Clean Up Initiated',
  clearTime: 720000,
  signOutTime: 180000
}

util.getConstant = () => {
  return defaultConstant;
}

module.exports = util;