const Book = require('../models/Book');

const getBooks = async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json(books);
    }
    catch (err) {
        res.status(404).json({ error: err });
    }
};

const getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        
        if (!book) return res.status(404).json({ error: "Not found" });
       
        res.status(200).json(book);
    }
    catch (err) {
        res.status(404).json({ error: err });
    }
};

const createBook = async (req, res) => {
    // console.log(req.body.name);
    try {
        const newBook = new Book(req.body);        
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};

const updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!book) return res.status(404).json({ error: "Not found" });

        res.status(200).json(book);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        
        if (!book) return res.status(404).json({ error: "Not found" });

        res.status(204).end();
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};

// For frontend
const getBooksForView = async () => {
    const books = await Book.find({});
    return books.map(book => ({
        id: book._id,
        title: book.name,
        summary: book.summary || 'No summary',
        publicationDate: book.publicationDate || 'Unknown',
        reviewCount: book.reviews ? book.reviews.length : 0,
        totalSales: book.sales ? book.sales.reduce((sum, s) => sum + s.sales, 0) : 0
    }));
};

module.exports = {
    getBooksForView,
    getBooks: async (req, res) => { /* ... */ },
    getBook: async (req, res) => { /* ... */ },
    createBook: async (req, res) => { /* ... */ },
    updateBook: async (req, res) => { /* ... */ },
    deleteBook: async (req, res) => { /* ... */ }
};