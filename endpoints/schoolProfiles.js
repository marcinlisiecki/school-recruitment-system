const express = require('express');
const { SchoolProfile } = require('../models/schoolProfile.js');
const schoolProfilesRouter = express.Router();

schoolProfilesRouter.get("/:id", async (req, res) => {
  const schoolProfile = await SchoolProfile.findById(req.params.id);
  res.render("admin/school-profiles/view", { schoolProfile })
})

module.exports = { schoolProfilesRouter };