const express = require('express');
const app = express();
const routes = require('./routes');
const mongoose = require('mongoose');
const { mongoURI, PORT } = require('./constants');

mongoose.connect(mongoURI)
    .then(() => console.log('Mongo connected'))
    .catch((err) => console.error('Failed to connect mongo, ', err))


// Views settings
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/', routes);

app.listen(PORT, () => {
    console.log('Server started, receiving requests...');
});