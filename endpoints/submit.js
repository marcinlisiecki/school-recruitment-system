const express = require('express');
const submitRouter = express.Router();

const { Application } = require("../models/application.js");
const { ApplicationProfile } = require("../models/applicationProfile.js");
const { SchoolProfile } = require("../models/schoolProfile.js")

submitRouter.get('/', (req, res) => {
  res.render('submit/form-view');
});

submitRouter.post('/', async (req, res) => {
  const { name, pesel, address, zipCode, city, profiles } = req.body;

  const application = new Application({
    name, pesel, address, zipCode, city
  })

  for (const profile of profiles) {
    const schoolProfile = await SchoolProfile.findById(profile._id);
    const score = schoolProfile.criteria.reduce((total, criteria) => {
      return total + profile.criteriaSubmission[criteria._id] * criteria.multiplier;
    }, 0)

    const applicationProfile = new ApplicationProfile({
      profile: profile._id,
      school: profile.school,
      score,
      criteriaSubmission: Object.keys(profile.criteriaSubmission).map(key => ({
        criteriaId: key,
        value: parseFloat(profile.criteriaSubmission[key])
      }))
    })

    await applicationProfile.save();
    application.profiles.push(applicationProfile);
  }

  await application.save();

  res.render('submit/form-view', { success: true });
});

module.exports = {submitRouter};