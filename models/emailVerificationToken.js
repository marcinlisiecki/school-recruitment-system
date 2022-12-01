const mongoose = require('mongoose');

const EmailVerificationToken = mongoose.model('EmailVerificationToken', {
  token: String,
  email: String,
  expires: Date,
  isActive: Boolean,
});

module.exports = { EmailVerificationToken };