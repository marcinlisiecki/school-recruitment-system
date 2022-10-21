const express = require('express');
const { User } = require('../models/user');
const usersRouter = express.Router();

usersRouter.get('/', async (req, res) => {
    const users = await User.find({});
    res.render('admin/users/index', { users });
});

usersRouter.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
        // TODO: handle 404
    }

    res.render('admin/users/view', { user });
});

module.exports = { usersRouter };