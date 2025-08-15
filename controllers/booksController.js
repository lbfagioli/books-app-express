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

module.exports = {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
};