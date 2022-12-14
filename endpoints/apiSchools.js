const express = require('express');
const { findSchoolsByQuery } = require("../utils/schools");
const apiSchoolsRouter = express.Router();

apiSchoolsRouter.get('/search/:query', async (req, res) => {
    const { query } = req.params;
    const schools = await findSchoolsByQuery(query).populate('profiles');
    res.json(schools);
});

module.exports = { apiSchoolsRouter };
