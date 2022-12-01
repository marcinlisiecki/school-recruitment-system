require('dotenv').config();
const express = require('express');
const authRouter = express.Router();
const { User } = require("../models/user.js");
const { PasswordResetToken } = require("../models/passwordResetToken.js")
const { v4: uuid } = require('uuid');
const moment = require("moment");
const { getTransporter } = require("../utils/mailer.js");
const { hashPassword } = require("../utils/password.js");
const passport = require("passport");
const {AUTH_LOCAL} = require("../consts/authStrategies");
const {EmailVerificationToken} = require("../models/emailVerificationToken.js");

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
    from: process.env.MAILER_EMAIL,
    to: email,
    subject: "Resetowanie hasła",
    text: "http://localhost:3000/auth/forgot-password/change/" + token,
  });

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


authRouter.post("/forgot-password/change/:token", async (req, res) => {
  const tokenString = req.params.token;
  const newPassword = req.body.newPassword;

  const token = await PasswordResetToken.findOne({ token: tokenString })
  if (!token) {
    return res.redirect('/auth/forgot-password')
  }

  if (moment(new Date()).isAfter(moment(token.expires)) || !token.isActive) {
    return res.render('auth/forgot-password/change', { error: "Link do resetowania hasła wygasł" })
  }

  const hashedPassword = hashPassword(newPassword);
  await User.findOneAndUpdate({ email: token.email }, { password: hashedPassword })

  token.isActive = false;
  await token.save();

  return res.render('auth/forgot-password/change', { success: true })
})

authRouter.get('/register', (req, res) => {
  res.render('auth/register');
});

authRouter.post('/register', async (req, res) => {
  const {email, name, password} = req.body;

  if (await User.exists({ email })) {
    // TODO: handle it.
  }

  const hashedPassword = hashPassword(password);
  await User.create({ email, name, password: hashedPassword, role: 'user' });

  const token = uuid();
  const expires = moment(new Date()).add(24, 'hours').toDate();

  await EmailVerificationToken.create({
    email, token, expires,
    isActive: true,
  })

  await getTransporter().sendMail({
    from: process.env.MAILER_EMAIL,
    to: email,
    subject: "Weryfikacja adresu Email",
    text: "http://localhost:3000/auth/verify-email/" + token,
  });

  res.render('auth/success', { message: 'Twoje konto zostało utworzone pomyślnie. Link z weryfikacją adresu Email został wysłany na podany adres.' });
});

authRouter.get('/login', async (req, res) => {
  res.render('auth/login');
});

authRouter.post('/login', passport.authenticate(AUTH_LOCAL, {
  successRedirect: '/',
  failureRedirect: '/auth/login',
}));

authRouter.post('/logout', (req, res) => {
  req.session.passport = {};
  res.redirect('/auth/login');
});

authRouter.get("/verify-email/:token", async (req, res) => {
  const tokenString = req.params.token;

  const token = await EmailVerificationToken.findOne({ token: tokenString })
  if (!token) {
    return res.redirect('/')
  }

  if (moment(new Date()).isAfter(moment(token.expires)) || !token.isActive) {
    return res.render('auth/verify-email', { error: "Link do weryfikacji adresu email wygasł" })
  }

  await User.findOneAndUpdate({ email: token.email }, { emailVerificationDate: new Date() })

  token.isActive = false;
  await token.save();

  return res.render('auth/verify-email', { success: true })
})

module.exports = { authRouter }

