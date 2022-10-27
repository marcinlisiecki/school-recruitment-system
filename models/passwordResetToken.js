const mongoose = require('mongoose');

const PasswordResetToken = mongoose.model('PasswordResetToken', {
  token: String,
  email: String,
  expires: Date,
  isActive: Boolean,
});

module.exports = { PasswordResetToken };