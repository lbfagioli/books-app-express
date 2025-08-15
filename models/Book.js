const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: String
});

module.exports = mongoose.model('Book', bookSchema);