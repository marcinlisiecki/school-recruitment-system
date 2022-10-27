const mongoose = require('mongoose');

const PasswordResetToken = mongoose.model('PasswordResetToken', {
  token: String,
  expires: Date,
  isActive: Boolean,
});

module.exports = { PasswordResetToken };