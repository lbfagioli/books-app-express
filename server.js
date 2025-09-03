const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes');
const mongoose = require('mongoose');
const { uploadPath } = require('./utils/multer');
const { mongoURI, PORT, serveStatic } = require('./constants');


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
if (serveStatic) {
    app.use('/uploads', express.static(uploadPath));
}
else {
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}
app.use('/', routes);


app.listen(PORT, () => {
    console.log('Server started, receiving requests...');
});