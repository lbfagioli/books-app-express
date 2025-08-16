// routes.js
const express = require('express');
const router = express.Router();
const homeController = require('./controllers/homeController');
const authorsController = require('./controllers/authorsController');
const booksController = require('./controllers/booksController');

// Home
router.get('/', homeController.getHome);

// Authors
router.get('/authors', authorsController.getAuthors);

// Books
router.get('/books', booksController.getBooks);

// Books top rated
router.get('/books/top-rated', booksController.getTopRatedBooks);

// Books top selling
router.get('/books/top-selling', booksController.getTopSellingBooks);

// Search
router.get('/search', booksController.getSearch);

// API detail
router.get('/api/books/:id', booksController.getBook);
router.post('/api/books', booksController.createBook);
router.patch('/api/books/:id', booksController.updateBook);
router.delete('/api/books/:id', booksController.deleteBook);

router.get('/api/authors/:id', authorsController.getAuthor);
router.post('/api/authors', authorsController.createAuthor);
router.patch('/api/authors/:id', authorsController.updateAuthor);
router.delete('/api/authors/:id', authorsController.deleteAuthor);

module.exports = router;
