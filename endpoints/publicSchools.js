const express = require('express');
const { School } = require('../models/school');
const publicSchoolsRouter = express.Router();

publicSchoolsRouter.get('/', async (req, res) => {
    const schools = await School.find({});
    res.render('schools/index', { schools });
});

publicSchoolsRouter.get('/:id', async (req, res) => {
    const school = await School.findById(req.params.id);
    
    if (!school) {
        // TODO: handle 404
    }

    res.render('schools/view', { school });
});

module.exports = { publicSchoolsRouter };