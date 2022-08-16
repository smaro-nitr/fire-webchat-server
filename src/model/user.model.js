const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  lastLogin: {
    type: String,
    required: true,
  },
  loggedIn: {
    type: Boolean,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
