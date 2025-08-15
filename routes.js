const express = require('express');
const router = express.Router();
const homeController = require('./controllers/homeController');
const booksController = require('./controllers/booksController');

router.get('/', homeController.getHome);

// Frontend
router.get('/books', async (req, res) => {
    try {
        const books = await booksController.getBooksForView();
        res.render('books', { books });
    } catch (err) {
        res.status(500).send(err);
    }
});

// API endpoints
router.get('/api/books', booksController.getBooks);
router.get('/api/books/:id', booksController.getBook);
router.post('/api/books', booksController.createBook);
router.patch('/api/books/:id', booksController.updateBook);
router.delete('/api/books/:id', booksController.deleteBook);

module.exports = router;
