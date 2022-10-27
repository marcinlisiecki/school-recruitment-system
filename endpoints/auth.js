const express = require('express');
const authRouter = express.Router();
const { User } = require("../models/user.js");
const { PasswordResetToken } = require("../models/passwordResetToken.js")
const { v4: uuid } = require('uuid');
const moment = require("moment")

authRouter.get("/forgot-password", (req, res) => {
  res.render('auth/forgot-password/index');
})

authRouter.post("/forgot-password", async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({ email });
  if (!user) {
    return res.render('auth/forgot-password/index', { error: "W łeb się walnij" })
  }

  const token = uuid();
  const expires = moment(new Date()).add(15, 'minutes').toDate();

  await PasswordResetToken.create({
    email, token, expires,
  })

  // TODO: deactivate all other user tokens

  return res.render('auth/forgot-password/index', { success: true })
})

authRouter.get("/forgot-password/change/:token", async (req, res) => {
  const tokenString = req.params.token;

  const token = await PasswordResetToken.findOne({ token: tokenString })
  if (!token) {
    return res.redirect('/auth/forgot-password')
  }

  if (moment(new Date()).add(15, 'minutes').isAfter(moment(token.expires)) || !token.isActive) {
    return res.render('auth/forgot-password/change', { error: "Link do resetowania hasła wygasł" })
  }

  return res.render('auth/forgot-password/change')
})

module.exports = { authRouter }

