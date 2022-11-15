const mongoose = require('mongoose');

const SchoolProfile = mongoose.model('SchoolProfile', {
  name: String,
  description: String,
  availablePlaces: Number,
});

module.exports = { SchoolProfile };