const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewText: String,
    score: { type: Number, min: 1, max: 5 },
    upvotes: { type: Number, default: 0 }
});

const saleSchema = new mongoose.Schema({
    year: Number,
    sales: { type: Number, default: 0 }
});

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    summary: String,
    publicationDate: Date,
    reviews: [reviewSchema],
    sales: [saleSchema]
});

module.exports = mongoose.model('Book', bookSchema);
