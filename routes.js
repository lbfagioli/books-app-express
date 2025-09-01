const upload = require('./utils/multer');

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

// Web CRUD Authors
router.get('/authors/new', authorsController.renderNewAuthorForm); //upload.single('photo')
router.post('/authors', authorsController.createAuthorWeb);
router.get('/authors/:id/edit', authorsController.renderEditAuthorForm);
router.post('/authors/:id', authorsController.updateAuthorWeb);
router.post('/authors/:id/delete', authorsController.deleteAuthorWeb);

// Books
router.get('/books', booksController.getBooks);

// Web CRUD Books
router.get('/books/new', booksController.renderNewBookForm);
router.post('/books', upload.single('coverImage'), booksController.createBookWeb);
router.get('/books/:id/edit', booksController.renderEditBookForm);
router.post('/books/:id', upload.single('coverImage'), booksController.updateBookWeb);
router.post('/books/:id/delete', booksController.deleteBookWeb);

// Books top rated
router.get('/books/top-rated', booksController.getTopRatedBooks);

// Books top selling
router.get('/books/top-selling', booksController.getTopSellingBooks);


// Reviews CRUD (web)
router.post('/books/:id/reviews', booksController.addReviewWeb);
router.post('/books/:id/reviews/:reviewId', booksController.updateReviewWeb);
router.post('/books/:id/reviews/:reviewId/delete', booksController.deleteReviewWeb);

// Sales CRUD (web)
router.post('/books/:id/sales', booksController.addSaleWeb);
router.post('/books/:id/sales/:saleId', booksController.updateSaleWeb);
router.post('/books/:id/sales/:saleId/delete', booksController.deleteSaleWeb);

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
