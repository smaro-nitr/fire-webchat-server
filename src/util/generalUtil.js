const util = {};

appendZero = (value) => {
  return Number(value) < 10 ? `0${value}` : value;
};

util.lastLogin = () => {
  const newDate = new Date();
  const date = appendZero(newDate.getDate());
  const month = appendZero(newDate.getMonth() + 1);
  const hour = newDate.getHours();
  const hour12 = appendZero(hour % 12);
  const minute = appendZero(newDate.getMinutes());

  return `${date}/${month} ${hour12}:${minute}${hour > 11 ? "PM" : "AM"}`;
};

util.timeStamp = () => {
  const newDate = new Date();
  const hour12 = appendZero(newDate.getHours() % 12);
  const minute = appendZero(newDate.getMinutes());
  const second = appendZero(newDate.getSeconds());
  return `${hour12}:${minute}:${second}`;
};

module.exports = util;
