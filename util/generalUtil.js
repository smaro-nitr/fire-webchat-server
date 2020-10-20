const util = {}

const defaultConstant = {
  clearTimeMessage: 'Chat Clean Up Initiated',
  clearTime: 600000,
  signOutTime: 120000,
  warningTime: 30000
}

util.getConstant = () => {
  return defaultConstant;
}

util.lastLogin = () => {
  const newDate = new Date();
  const hourFull = newDate.getHours()
  const hour = hourFull % 12
  return `${newDate.getDate()}/${newDate.getMonth()+1} ${hour}:${newDate.getMinutes()}${hourFull > 11 ? 'PM':'AM'}`;
}

util.timeStamp = () => {
  const newDate = new Date();
  return `${newDate.getHours() % 12}:${newDate.getMinutes()}:${newDate.getSeconds()}`
}

module.exports = util;