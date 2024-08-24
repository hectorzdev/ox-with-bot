const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  point: { type: Number, default: 0 },
  consecutiveWins: {
    type: Number,
    default: 0
  }
});

const User = mongoose.model('users', userSchema);

module.exports = User;
