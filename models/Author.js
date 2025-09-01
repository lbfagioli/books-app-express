const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dateOfBirth: Date,
    country: String,
    description: String,
    portrait: { type: String } // stores the filename
});

module.exports = mongoose.model('Author', authorSchema);
