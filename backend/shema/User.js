const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  facebookId: String,
  fullname: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  point: { type: Number, default: 0 },
  win: { type: Number, default: 0 },
  streak: { type: Number, default: 0 } 
});

const User = mongoose.model('users', userSchema);

module.exports = User;
