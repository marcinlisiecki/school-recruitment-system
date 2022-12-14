const express = require('express');
const { School } = require('../models/school');
const { findSchoolsByQuery } = require("../utils/schools");
const publicSchoolsRouter = express.Router();

publicSchoolsRouter.get('/', async (req, res) => {
    let schools;
    const { search } = req.query;
    if (!search) {
        schools = await School.find({});
    } else {
        schools = await findSchoolsByQuery(search);
    }
    res.render('schools/index', { schools, search });
});

publicSchoolsRouter.get('/:id', async (req, res) => {
    const school = await School.findById(req.params.id).populate('profiles');

    if (!school) {
        // TODO: handle 404
    }

    res.render('schools/view', { school });
});

module.exports = { publicSchoolsRouter };