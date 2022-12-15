const mongoose = require('mongoose');

const SubmissionProfile = mongoose.model('SubmissionProfile', {
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School'
  },
  criteriaSubmission: [{
    criteriaId: mongoose.Schema.Types.ObjectId,
    value: Number
  }],
  score: Number,
  submission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission'
  },
});

module.exports = { SubmissionProfile };