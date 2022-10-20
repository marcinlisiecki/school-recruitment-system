require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded());

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