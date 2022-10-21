const express = require('express');
const { User } = require('../models/user');
const usersRouter = express.Router();

usersRouter.get('/', async (req, res) => {
    const users = await User.find({});
    res.render('admin/users/index', { users });
});

module.exports = { usersRouter };