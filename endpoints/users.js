const express = require('express');
const { User } = require('../models/user');
const usersRouter = express.Router();

usersRouter.get('/', async (req, res) => {
    const users = await User.find({});
    res.render('admin/users/index', { users });
});

usersRouter.get('/create', async (req, res) => {
    res.render('admin/users/create');
});

usersRouter.post('/create', async (req, res) => {

    const { name, email, role } = req.body; 

    const user = await User.create({
        name, email, role,
        emailVerificationDate: null,
    });

    res.redirect('/admin/users/' + user._id);
});

usersRouter.get('/:id/edit', async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
        // TODO: handle 404
    }

    res.render('admin/users/edit', { user });
});

usersRouter.post('/:id/edit', async (req, res) => {

    const { name, email, role } = req.body; 
    const user = await User.findById(req.params.id);
    
    if (!user) {
        // TODO: handle 404
    }

    await user.update({ $set: { name, email, role } });

    res.redirect('/admin/users/' + user._id);
});

usersRouter.post('/:id/delete', async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
        // TODO: handle 404
    }

    await user.delete();

    res.redirect('/admin/users');
});

usersRouter.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
        // TODO: handle 404
    }

    res.render('admin/users/view', { user });
});

module.exports = { usersRouter };