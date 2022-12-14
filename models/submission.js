const mongoose = require('mongoose');

const Submission = mongoose.model('Submission', {
  name: String,
  pesel: String,
  address: String,
  zipCode: String,
  profiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubmissionProfile'
  }]
});

module.exports = { Submission };