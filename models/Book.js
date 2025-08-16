const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewText: String,
    score: { type: Number, min: 1, max: 5 },
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
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' }, // relation with Author
    reviews: [reviewSchema],
    sales: [salesSchema]
});

module.exports = mongoose.model('Book', bookSchema);