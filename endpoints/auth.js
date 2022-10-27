const express = require('express');
const authRouter = express.Router();
const { User } = require("../models/user.js");
const { PasswordResetToken } = require("../models/passwordResetToken.js")
const { v4: uuid } = require('uuid');
const moment = require("moment");
const { getTransporter } = require("../utils/mailer.js");

authRouter.get("/forgot-password", (req, res) => {
  res.render('auth/forgot-password/index');
})

authRouter.post("/forgot-password", async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({ email });
  if (!user) {
    return res.render('auth/forgot-password/index', { error: "Nie znaleziono użytkownika o takim adresie email" })
  }

  const token = uuid();
  const expires = moment(new Date()).add(15, 'minutes').toDate();

  await PasswordResetToken.create({
    email, token, expires,
    isActive: true,
  })

  await getTransporter().sendMail({
    from: 'banasiowe.trolololo@gmail.com',
    to: email,
    subject: "Resetowanie hasła",
    text: "http://localhost:3000/auth/forgot-password/change/" + token,
  });

  // TODO: deactivate all other user tokens

  return res.render('auth/forgot-password/index', { success: true })
})

authRouter.get("/forgot-password/change/:token", async (req, res) => {
  const tokenString = req.params.token;

  const token = await PasswordResetToken.findOne({ token: tokenString })
  if (!token) {
    return res.redirect('/auth/forgot-password')
  }

  if (moment(new Date()).isAfter(moment(token.expires)) || !token.isActive) {
    return res.render('auth/forgot-password/change', { error: "Link do resetowania hasła wygasł" })
  }

  return res.render('auth/forgot-password/change')
})

module.exports = { authRouter }

