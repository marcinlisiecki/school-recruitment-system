const express = require('express');
const { Announcement } = require('../models/announcement');
const announcementsRouter = express.Router();

announcementsRouter.get('/', async (req, res) => {
    const announcement = await Announcement.find({});
    res.render('admin/announcements/index', { announcement });
});

announcementsRouter.get('/create', async (req, res) => {
    res.render('admin/announcements/create');
});

announcementsRouter.post('/create', async (req, res) => {

    const { title, content } = req.body;

    const announcement = await Announcement.create({
        title, content,
    });

    res.redirect('/admin/announcements/' + announcement._id);
});

announcementsRouter.get('/:id/edit', async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        // TODO: handle 404
    }

    res.render('admin/announcements/edit', { announcement });
});

announcementsRouter.post('/:id/edit', async (req, res) => {

    const { title, content } = req.body;
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        // TODO: handle 404
    }

    await announcement.update({ $set: { title, content } });

    res.redirect('/admin/announcements/' + announcement._id);
});

announcementsRouter.post('/:id/delete', async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        // TODO: handle 404
    }

    await announcement.delete();

    res.redirect('/admin/announcements');
});

announcementsRouter.get('/:id', async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        // TODO: handle 404
    }

    res.render('admin/announcements/view', { announcement });
});

module.exports = { announcementsRouter };