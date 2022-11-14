const express = require('express');
const { SchoolProfile } = require('../models/schoolProfile.js');
const { School } = require("../models/school.js");
const schoolProfilesRouter = express.Router();

schoolProfilesRouter.get("/:id", async (req, res) => {
  const schoolProfile = await SchoolProfile.findById(req.params.id);
  const school = await School.findOne({ profiles: schoolProfile })

  res.render("admin/school-profiles/view", { schoolProfile, school });
})

schoolProfilesRouter.get("/:id/edit", async (req, res) => {
  const schoolProfile = await SchoolProfile.findById(req.params.id);
  res.render("admin/school-profiles/edit", { schoolProfile });
})

schoolProfilesRouter.post("/:id/edit", async (req, res) => {
  const { name, description, availablePlaces } = req.body;

  await SchoolProfile.findByIdAndUpdate(req.params.id, { $set: { name, description, availablePlaces }});

  res.redirect('/admin/school-profiles/' + req.params.id);
})

module.exports = { schoolProfilesRouter };