const express = require('express');
const { School } = require('../models/school');
const { SchoolProfile } = require("../models/schoolProfile.js")
const schoolsRouter = express.Router();

schoolsRouter.get('/', async (req, res) => {
    const schools = await School.find({});
    res.render('admin/schools/index', { schools });
});

schoolsRouter.get('/create', async (req, res) => {
    res.render('admin/schools/create');
});

schoolsRouter.post('/create', async (req, res) => {

    const { name, address, city, zipCode, description, email, phone } = req.body; 

    const school = await School.create({
        name, address, city, zipCode, description, email, phone,
    });

    res.redirect('/admin/schools/' + school._id);
});

schoolsRouter.get('/:id/edit', async (req, res) => {
    const school = await School.findById(req.params.id);
    
    if (!school) {
        // TODO: handle 404
    }

    res.render('admin/schools/edit', { school });
});

schoolsRouter.post('/:id/edit', async (req, res) => {

    const { name, address, city, zipCode, description, email, phone } = req.body; 
    const school = await School.findById(req.params.id);
    
    if (!school) {
        // TODO: handle 404
    }

    await school.update({ $set: { name, address, city, zipCode, description, email, phone } });

    res.redirect('/admin/schools/' + school._id);
});

schoolsRouter.post('/:id/delete', async (req, res) => {
    const school = await School.findById(req.params.id);
    
    if (!school) {
        // TODO: handle 404
    }

    await school.delete();

    res.redirect('/admin/schools');
});

schoolsRouter.get('/:id', async (req, res) => {
    const school = await School.findById(req.params.id).populate("profiles");

    if (!school) {
        // TODO: handle 404
    }

    res.render('admin/schools/view', { school });
});

schoolsRouter.get("/:id/school-profiles/create", async (req, res) => {
  res.render('admin/school-profiles/create');
})

schoolsRouter.post("/:id/school-profiles/create", async (req, res) => {
  const schoolId = req.params.id;
  const { name, description, availablePlaces, criteria } = req.body;

  const schoolProfile = await SchoolProfile.create({
    name, description, availablePlaces, criteria
  });

  const school = await School.findById(schoolId);
  school.profiles.push(schoolProfile);
  await school.save();

  res.redirect('/admin/schools/' + schoolId)
})

module.exports = { schoolsRouter };