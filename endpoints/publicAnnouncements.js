const express = require('express');
const { Announcement } = require('../models/announcement');
const publicAnnouncementsRouter = express.Router();

publicAnnouncementsRouter.get('/', async (req, res) => {
    const announcement = await Announcement.find({});
    res.render('announcements/index', { announcement });
});

publicAnnouncementsRouter.get('/:id', async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        // TODO: handle 404
    }

    res.render('announcements/view', { announcement });
});

module.exports = { publicAnnouncementsRouter };