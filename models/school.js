const mongoose = require('mongoose');
const School = mongoose.model('School', {
    name: String,
    address: String,
    city: String,
    zipCode: String,
    description: String,
    email: String,
    phone: String,
});

module.exports = {School};