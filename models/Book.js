const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewText: String,
    score: Number,
    upvotes: Number
});

const salesSchema = new mongoose.Schema({
    year: Number,
    sales: Number
});

const bookSchema = new mongoose.Schema({
    title: String,
    summary: String,
    publicationDate: Date,
    reviews: [reviewSchema],
    sales: [salesSchema]
});

module.exports = mongoose.model('Book', bookSchema);
