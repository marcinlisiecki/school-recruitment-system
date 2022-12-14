require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const session = require('express-session');
const { configurePassport } = require("./config/passport");
const { usersRouter } = require('./endpoints/users');
const { authRouter } = require('./endpoints/auth.js');
const { schoolsRouter } = require('./endpoints/schools');
const { announcementsRouter } = require('./endpoints/announcements');
const { passportUserMiddleware } = require("./middlewares/passportUserMiddleware");
const { schoolProfilesRouter } = require("./endpoints/schoolProfiles.js");
const { publicAnnouncementsRouter } = require('./endpoints/publicAnnouncements');
const { publicSchoolsRouter } = require("./endpoints/publicSchools");
const { contactRouter } = require('./endpoints/contact');
const { submitRouter } = require("./endpoints/submit");
const moment = require('moment');
const app = express();
const port = 3000;

require('moment/locale/pl');
const { apiSchoolsRouter } = require("./endpoints/apiSchools");
moment.locale('pl');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded());
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
}));
app.use(passportUserMiddleware);
configurePassport();

app.locals = { moment };

app.use('/admin/users', usersRouter);
app.use('/auth', authRouter);
app.use('/admin/schools', schoolsRouter);
app.use('/admin/announcements', announcementsRouter);
app.use('/admin/school-profiles', schoolProfilesRouter);
app.use('/announcements', publicAnnouncementsRouter);
app.use('/schools', publicSchoolsRouter);
app.use('/contact', contactRouter);
app.use('/submit', submitRouter);

app.use('/api/schools', apiSchoolsRouter);

app.get('/', (req, res) => {
    res.render('home');
});

const start = async () => {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to database!');

    app.listen(port, () => {
        console.log(`App listening on port ${port}.`);
    });
};

start().catch((e) => console.error('Error while starting application.', e));