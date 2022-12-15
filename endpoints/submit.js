const express = require('express');
const submitRouter = express.Router();

const { Submission } = require("../models/submission.js");
const { SubmissionProfile } = require("../models/submissionProfile.js");
const { SchoolProfile } = require("../models/schoolProfile.js")

submitRouter.get('/', (req, res) => {
  res.render('submit/form-view');
});

submitRouter.post('/', async (req, res) => {
  const { name, pesel, address, zipCode, city, profiles } = req.body;

  const submission = new Submission({
    name, pesel, address, zipCode, city
  })

  for (const profile of profiles) {
    const schoolProfile = await SchoolProfile.findById(profile._id);
    const score = schoolProfile.criteria.reduce((total, criteria) => {
      return total + profile.criteriaSubmission[criteria._id] * criteria.multiplier;
    }, 0)

    const submissionProfile = new SubmissionProfile({
      profile: profile._id,
      school: profile.school,
      score,
      criteriaSubmission: Object.keys(profile.criteriaSubmission).map(key => ({
        criteriaId: key,
        value: parseFloat(profile.criteriaSubmission[key])
      })),
      submission
    })

    await submissionProfile.save();
    submission.profiles.push(submissionProfile);
  }

  await submission.save();

  res.render('submit/form-view', { success: true });
});

module.exports = {submitRouter};