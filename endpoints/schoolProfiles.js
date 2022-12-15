const express = require('express');
const { SchoolProfile } = require('../models/schoolProfile.js');
const { School } = require("../models/school.js");
const { SubmissionProfile } = require('../models/submissionProfile.js');
const schoolProfilesRouter = express.Router();

schoolProfilesRouter.get("/:id", async (req, res) => {
  const schoolProfile = await SchoolProfile.findById(req.params.id);
  const school = await School.findOne({ profiles: schoolProfile });
  let profiles = await SubmissionProfile.find({ profile: schoolProfile }).populate("submission");
  profiles.sort((a, b) => {
    return b.score - a.score;
  })

  profiles = profiles.filter((_, index) => index < schoolProfile.availablePlaces)

  if (!schoolProfile) {
    // TODO: handle 404
  }

  res.render("admin/school-profiles/view", { schoolProfile, school, ranking: profiles });
})

schoolProfilesRouter.get("/:id/edit", async (req, res) => {
  const schoolProfile = await SchoolProfile.findById(req.params.id);

  if (!schoolProfile) {
    // TODO: handle 404
  }

  res.render("admin/school-profiles/edit", { schoolProfile });
})

schoolProfilesRouter.post("/:id/edit", async (req, res) => {
  const schoolProfile = await SchoolProfile.findById(req.params.id);
  const { name, description, availablePlaces } = req.body;

  if (!schoolProfile) {
    // TODO: handle 404
  }

  await schoolProfile.update({ $set: { name, description, availablePlaces } });

  res.redirect('/admin/school-profiles/' + req.params.id);
})

schoolProfilesRouter.post("/:id/delete", async (req, res) => {
  const schoolProfile = await SchoolProfile.findById(req.params.id);
  const school = await School.findOne({ profiles: schoolProfile })

  if (!schoolProfile) {
    // TODO: handle 404
  }

  await schoolProfile.delete();

  res.redirect('/admin/schools/' + school._id);
})

module.exports = { schoolProfilesRouter };