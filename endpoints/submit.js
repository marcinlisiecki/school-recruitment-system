const express = require('express');
const submitRouter = express.Router();

submitRouter.get('/', (req, res) => {
    res.render('submit/form-view');
});

submitRouter.post('/', (req, res) => {
    // TODO @Marcin Lisiecki
    res.json(req.body);
});

module.exports = { submitRouter };