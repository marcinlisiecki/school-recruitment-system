const mongoose = require('mongoose');

const SchoolProfile = mongoose.model('SchoolProfile', {
    name: String,
    description: String,
    availablePlaces: Number,
    criteria: [ {
        name: String,
        multiplier: Number,
    } ],
});

module.exports = { SchoolProfile };