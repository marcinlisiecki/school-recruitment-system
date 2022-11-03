require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const { usersRouter } = require('./endpoints/users');
const { authRouter } = require('./endpoints/auth.js');
const { schoolsRouter } = require('./endpoints/schools');
const { announcementsRouter } = require('./endpoints/announcements');
const moment = require('moment');
const app = express();
const port = 3000;

require('moment/locale/pl');
moment.locale('pl');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded());
app.use(express.static('public'));

app.locals = { moment };

app.use('/admin/users', usersRouter);
app.use('/auth', authRouter);
app.use('/admin/schools', schoolsRouter);
app.use('/admin/announcements', announcementsRouter);

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