const express = require('express');
const contactRouter = express.Router();
const { getTransporter } = require("../utils/mailer.js");

contactRouter.get("/", (req, res) => {
    res.render('contact/index');
})

contactRouter.post("/", async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const contents = req.body.contents;

    await getTransporter().sendMail({
        from: process.env.MAILER_EMAIL,
        to: process.env.HELPDESK_EMAIL,
        subject: "Kontakt " + name + " " + email,
        text: contents,
    });

    return res.render('contact/index', { success: true });
})

module.exports = { contactRouter }