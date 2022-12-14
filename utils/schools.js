const { School } = require("../models/school");
const findSchoolsByQuery = (query) => School.find({
    $or: [
        {name: {'$regex': query, '$options': 'i'}},
        {address: {'$regex': query, '$options': 'i'}},
        {city: {'$regex': query, '$options': 'i'}},
    ]
});

module.exports = { findSchoolsByQuery };