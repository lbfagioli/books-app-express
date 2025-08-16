const Author = require('../models/Author');
const Book = require('../models/Book');

const getAuthors = async (req, res) => {
    try {
        const { name, minBooks, maxBooks, minScore, maxScore, minSales, maxSales, minReviews, maxReviews } = req.query;

        const authors = await Author.find({});
        const stats = [];

        for (let author of authors) {
            const books = await Book.find({ author: author._id });

            const totalSales = books.reduce(
                (acc, book) => acc + book.sales.reduce((s, yr) => s + yr.sales, 0),
                0
            );

            const totalReviews = books.reduce((acc, book) => acc + book.reviews.length, 0);

            const avgScore =
                books.reduce((acc, book) => {
                    if (book.reviews.length > 0) {
                        return acc + (book.reviews.reduce((s, r) => s + r.score, 0) / book.reviews.length);
                    }
                    return acc;
                }, 0) / (books.length || 1);

            stats.push({
                name: author.name,
                bookCount: books.length,
                avgScore: parseFloat(avgScore.toFixed(2)),
                totalSales,
                totalReviews
            });
        }

        // 🔎 Apply filters
        let filtered = stats;

        if (name && name.trim() !== "") {
            filtered = filtered.filter(a =>
                a.name.toLowerCase().includes(name.toLowerCase())
            );
        }

        if (minBooks) filtered = filtered.filter(a => a.bookCount >= parseInt(minBooks));
        if (maxBooks) filtered = filtered.filter(a => a.bookCount <= parseInt(maxBooks));

        if (minScore) filtered = filtered.filter(a => a.avgScore >= parseFloat(minScore));
        if (maxScore) filtered = filtered.filter(a => a.avgScore <= parseFloat(maxScore));

        if (minSales) filtered = filtered.filter(a => a.totalSales >= parseInt(minSales));
        if (maxSales) filtered = filtered.filter(a => a.totalSales <= parseInt(maxSales));

        if (minReviews) filtered = filtered.filter(a => a.totalReviews >= parseInt(minReviews));
        if (maxReviews) filtered = filtered.filter(a => a.totalReviews <= parseInt(maxReviews));

        // API: return JSON
        if (req.originalUrl.startsWith('/api')) {
            return res.json(filtered);
        }

        // Render table with filters
        res.render('authors', {
            authors: filtered,
            filters: { name, minBooks, maxBooks, minScore, maxScore, minSales, maxSales, minReviews, maxReviews }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAuthor = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) return res.status(404).json({ error: "Not found" });
        res.json(author);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createAuthor = async (req, res) => {
    try {
        const author = new Author(req.body);
        const saved = await author.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateAuthor = async (req, res) => {
    try {
        const updated = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: "Not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteAuthor = async (req, res) => {
    try {
        await Author.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAuthors,
    getAuthor,
    createAuthor,
    updateAuthor,
    deleteAuthor
};