const mongoose = require('mongoose');
const School = mongoose.model('School', {
    name: String,
    address: String,
    city: String,
    zipCode: String,
    description: String,
    email: String,
    phone: String,
    profiles: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolProfile'
    }]
});

module.exports = {School};