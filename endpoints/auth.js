const express = require('express');
const authRouter = express.Router();

authRouter.get("/forgot-password", (req, res) => {
  res.render('auth/forgot-password');
})

module.exports = { authRouter }

