const express = require('express');
const app = express();
const PORT = 3000;
const routes = require('./routes');
const path = require('path');
const mongoose = require('mongoose');


// MongoDB settings
const mongoUri = 'mongodb://localhost:27017/books-app-db';

mongoose.connect(mongoUri)
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