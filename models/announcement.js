const mongoose = require('mongoose');
const Announcement = mongoose.model('Announcement', {
    title: String,
    content: String
});

module.exports = { Announcement };