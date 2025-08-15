const express = require('express');
const app = express();
const PORT = 3000;
const routes = require('./routes');
const mongoose = require('mongoose');

const mongoUri = 'mongodb://localhost:27017/books-app-db';

mongoose.connect(mongoUri)
    .then(() => console.log('Mongo connected'))
    .catch((err) => console.error('Failed to connect mongo, ', err))

app.use(express.json());
app.use('/', routes);

app.listen(PORT, () => {
    console.log('Server started, receiving requests...');
});