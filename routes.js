const express = require('express');
const router = express.Router();
const homeController = require('./controllers/homeController');
const booksController = require('./controllers/booksController');

router.get('/', homeController.getHome);

router.get('/books', booksController.getBooks);
router.get('/books/:id', booksController.getBook);
router.post('/books', booksController.createBook);
router.patch('/books/:id', booksController.updateBook);
router.delete('/books/:id', booksController.deleteBook);

module.exports = router;