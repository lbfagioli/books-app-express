const Book = require('../models/Book');
const { get } = require('mongoose');
const { getCache, setCache, delCache } = require('../utils/cache');

const getBooks = async (req, res) => {
    try {
        // Try cache first
        if (process.env.USE_CACHE === 'true') {
            const cached = await getCache('books_all');
            if (cached) {
                const cachedBooks = JSON.parse(cached);
                console.log('[CACHE GET] books_all');

                // Frontend view
                const booksForView = cachedBooks.map(book => ({
                    _id: book._id,
                    title: book.title,
                    summary: book.summary,
                    publicationDate: book.publicationDate,
                    reviewCount: book.reviews.length,
                    totalSales: book.sales.reduce((sum, s) => sum + s.sales, 0),
                    coverImage: book.coverImage
                }));

                if (req.originalUrl.startsWith('/api')) {
                    return res.status(200).json(cachedBooks);
                } else {
                    return res.render('books', { books: booksForView });
                }
            }
        }

        // If no cache, fetch from DB
        const books = await Book.find({});

        if (process.env.USE_CACHE === 'true') {
            await setCache('books_all', 3600, books); // 1h TTL
            console.log('[CACHE SET] books_all TTL=300s');
        }

        // Frontend
        const booksForView = books.map(book => ({
            _id: book._id,
            title: book.title,
            summary: book.summary,
            publicationDate: book.publicationDate,
            reviewCount: book.reviews.length,
            totalSales: book.sales.reduce((sum, s) => sum + s.sales, 0),
            coverImage: book.coverImage
        }));

        // To get raw data
        if (req.originalUrl.startsWith('/api')) {
            res.status(200).json(books);
        } else {
            // To frontend view
            res.render('books', { books: booksForView });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (process.env.USE_CACHE === 'true') {
            const cached = await getCache(`book:${id}`);
            if (cached) {
                console.log(`[CACHE GET] ook:${id}`);
                return res.status(200).json(JSON.parse(cached));
            }
        }

        if (!book) return res.status(404).json({ error: "Not found" });
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createBook = async (req, res) => {
    try {
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();

        if (process.env.USE_CACHE === 'true') {
            await delCache('books_all');
            await delCache('authors_stats');
            await delCache(`book:${savedBook._id}`);
        }

        res.status(201).json(savedBook);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) return res.status(404).json({ error: "Not found" });

        if (process.env.USE_CACHE === 'true') {
            await delCache('books_all');
            await delCache(`book:${req.params.id}`);
            await delCache(`book_reviews:${req.params.id}`);
            await delCache('authors_stats');
        }

        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ error: "Not found" });

        if (process.env.USE_CACHE === 'true') {
            await delCache('books_all');
            await delCache(`book:${req.params.id}`);
            await delCache(`book_reviews:${req.params.id}`);
            await delCache('authors_stats');
        }

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getTopRatedBooks = async (req, res) => {
    try {
        const { author, minScore, maxScore } = req.query;
        const key = `top_rated:${author||''}:${minScore||''}:${maxScore||''}`;

        if (process.env.USE_CACHE === 'true') {
            const cached = await getCache(key);
            if (cached) {
                const top10 = JSON.parse(cached);
                console.log(`[CACHE GET] ${key}`);
                if (req.originalUrl.startsWith('/api')) return res.json(top10);
                return res.render('topRatedBooks', { books: top10, filters: { author, minScore, maxScore } });
            }
        }

        // Get all books with author populated
        const books = await Book.find({}).populate('author');

        const ratedBooks = books.map(book => {
            const scores = book.reviews.map(r => r.score);
            const avgScore = scores.length > 0
                ? scores.reduce((a, b) => a + b, 0) / scores.length
                : 0;

            const highestReview = book.reviews.length > 0
                ? book.reviews.reduce((max, r) => r.score > max.score ? r : max, book.reviews[0])
                : null;

            const lowestReview = book.reviews.length > 0
                ? book.reviews.reduce((min, r) => r.score < min.score ? r : min, book.reviews[0])
                : null;

            return {
                title: book.title,
                author: book.author ? book.author.name : "Unknown",
                avgScore,
                highestReview: highestReview ? highestReview.reviewText : "N/A",
                lowestReview: lowestReview ? lowestReview.reviewText : "N/A",
                coverImage: book.coverImage
            };
        });

        // Apply filters
        let filtered = ratedBooks;

        if (author && author.trim() !== "") {
            filtered = filtered.filter(b =>
                b.author.toLowerCase().includes(author.toLowerCase())
            );
        }

        if (minScore) {
            filtered = filtered.filter(b => b.avgScore >= parseFloat(minScore));
        }

        if (maxScore) {
            filtered = filtered.filter(b => b.avgScore <= parseFloat(maxScore));
        }

        // Sort and take top 10
        const top10 = filtered
            .sort((a, b) => b.avgScore - a.avgScore)
            .slice(0, 10);

        if (process.env.USE_CACHE === 'true') {
            await setCache(key, 3600, top10);
            console.log(`[CACHE SET] ${key} TTL=3600s`);
        }

        if (req.originalUrl.startsWith('/api')) {
            return res.json(top10);
        }

        res.render('topRatedBooks', {
            books: top10,
            filters: { author, minScore, maxScore }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Top 50 selling books of all time
const getTopSellingBooks = async (req, res) => {
    try {
        const { author, top5 } = req.query; // filters
        const key = `top_selling:${author||''}:${top5||''}`;

        if (process.env.USE_CACHE === 'true') {
            const cached = await getCache(key);
            if (cached) {
                const top50 = JSON.parse(cached);
                console.log(`[CACHE GET] ${key}`);
                if (req.originalUrl.startsWith('/api')) return res.json(top50);
                return res.render('topSellingBooks', { books: top50, filters: { author, top5 } });
            }
        }

        const books = await Book.find({}).populate('author');

        const sellingBooks = books.map(book => {
            const totalSales = book.sales.reduce((acc, s) => acc + s.sales, 0);

            // Total sales by author
            let authorTotal = 0;
            if (book.author) {
                authorTotal = books
                    .filter(b => String(b.author?._id) === String(book.author._id))
                    .reduce((acc, b) => acc + b.sales.reduce((s, yr) => s + yr.sales, 0), 0);
            }

            // Was it in top 5 of its publication year?
            const year = book.publicationDate ? book.publicationDate.getFullYear() : null;
            let top5OfYear = false;
            if (year) {
                const yearBooks = books.filter(b =>
                    b.publicationDate && b.publicationDate.getFullYear() === year
                );
                const sortedYear = yearBooks.sort((a, b) => {
                    const sa = a.sales.reduce((s, yr) => s + yr.sales, 0);
                    const sb = b.sales.reduce((s, yr) => s + yr.sales, 0);
                    return sb - sa;
                });
                const top5 = sortedYear.slice(0, 5).map(b => b._id.toString());
                top5OfYear = top5.includes(book._id.toString());
            }

            return {
                title: book.title,
                author: book.author ? book.author.name : "Unknown",
                totalSales,
                authorTotal,
                top5OfYear,
                coverImage: book.coverImage
            };
        });

        // Apply filters
        let filtered = sellingBooks;

        if (author && author.trim() !== "") {
            filtered = filtered.filter(b =>
                b.author.toLowerCase().includes(author.toLowerCase())
            );
        }

        if (top5 === "true" || top5 === "false") {
            const boolVal = top5 === "true";
            filtered = filtered.filter(b => b.top5OfYear === boolVal);
        }
        
        // Sort + limit
        const top50 = filtered
            .sort((a, b) => b.totalSales - a.totalSales)
            .slice(0, 50);

        if (process.env.USE_CACHE === 'true') {
            await setCache(key, 3600, top50);
            console.log(`[CACHE SET] ${key} TTL=3600s`);
        }

        if (req.originalUrl.startsWith('/api')) {
            return res.json(top50);
        }

        res.render('topSellingBooks', { books: top50, filters: { author, top5 } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getSearch = async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;
        const key = `search:${q||''}:p${page}:l${limit}`;

        if (process.env.USE_CACHE === 'true') {
            const cached = await getCache(key);
            if (cached) {
                const { books, totalPages } = JSON.parse(cached);
                console.log(`[CACHE GET] ${key}`);
                return res.render('search', { books, q, page: parseInt(page), totalPages });
            }
        }

        // Search title or in summary
        const regex = new RegExp(q, 'i'); 
        const books = await Book.find({
            $or: [
                { title: regex },
                { summary: regex }
            ]
        })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

        const totalBooks = await Book.countDocuments({
            $or: [
                { title: regex },
                { summary: regex }
            ]
        });

        const totalPages = Math.ceil(totalBooks / limit);

        if (process.env.USE_CACHE === 'true') {
            await setCache(key, 300, { books, totalPages });
            console.log(`[CACHE SET] ${key} TTL=300s`);
        }

        res.render('search', { books, q, page: parseInt(page), totalPages });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    getTopRatedBooks,
    getTopSellingBooks,
    getSearch
    ,renderNewBookForm
    ,createBookWeb
    ,renderEditBookForm
    ,updateBookWeb
    ,deleteBookWeb
    ,addReviewWeb
    ,updateReviewWeb
    ,deleteReviewWeb
    ,addSaleWeb
    ,updateSaleWeb
    ,deleteSaleWeb
};

// --- Reviews CRUD ---
async function addReviewWeb(req, res) {
    try {
        const book = await Book.findById(req.params.id);
        book.reviews.push(req.body);
        await book.save();

        if (process.env.USE_CACHE === 'true') {
            await delCache('books_all');
            console.log('[CACHE DEL] books_all');
            await delCache(`book:${book._id}`);
            console.log(`[CACHE DEL] book:${book._id}`);
            await delCache(`book_reviews:${book._id}`);
            console.log(`book_reviews:${book._id}`);
            await delCache('authors_stats');
            console.log('[CACHE DEL] authors_stats');
        }

        res.redirect(`/books/${book._id}/edit`);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

async function updateReviewWeb(req, res) {
    try {
        const book = await Book.findById(req.params.id);
        const review = book.reviews.id(req.params.reviewId);
        if (!review) return res.status(404).send('Review not found');
        review.reviewText = req.body.reviewText;
        review.score = req.body.score;
        review.upvotes = req.body.upvotes;
        await book.save();

        if (process.env.USE_CACHE === 'true') {
            await delCache('books_all');
            console.log('[CACHE DEL] books_all');
            await delCache(`book:${book._id}`);
            console.log(`[CACHE DEL] book:${book._id}`);
            await delCache(`book_reviews:${book._id}`);
            console.log(`book_reviews:${book._id}`);
            await delCache('authors_stats');
            console.log('[CACHE DEL] authors_stats');
        }

        res.redirect(`/books/${book._id}/edit`);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

async function deleteReviewWeb(req, res) {
    try {
        const book = await Book.findById(req.params.id);
        // Try Mongoose subdoc remove
        const reviewSubdoc = book.reviews.id(req.params.reviewId);
        if (reviewSubdoc && typeof reviewSubdoc.remove === 'function') {
            reviewSubdoc.remove();
        } else {
            // Fallback: filter out by _id
            book.reviews = book.reviews.filter(r => r._id?.toString() !== req.params.reviewId);
        }
        await book.save();

        if (process.env.USE_CACHE === 'true') {
            await delCache('books_all');
            console.log('[CACHE DEL] books_all');
            await delCache(`book:${book._id}`);
            console.log(`[CACHE DEL] book:${book._id}`);
            await delCache(`book_reviews:${book._id}`);
            console.log(`book_reviews:${book._id}`);
            await delCache('authors_stats');
            console.log('[CACHE DEL] authors_stats');
        }

        res.redirect(`/books/${book._id}/edit`);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// --- Sales CRUD ---
async function addSaleWeb(req, res) {
    try {
        const book = await Book.findById(req.params.id);
        book.sales.push(req.body);
        await book.save();

        if (process.env.USE_CACHE === 'true') {
            await delCache('books_all');
            console.log('[CACHE DEL] books_all');
            await delCache(`book:${book._id}`);
            console.log(`[CACHE DEL] book:${book._id}`);
            await delCache(`book_reviews:${book._id}`);
            console.log(`book_reviews:${book._id}`);
            await delCache('authors_stats');
            console.log('[CACHE DEL] authors_stats');
        }

        res.redirect(`/books/${book._id}/edit`);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

async function updateSaleWeb(req, res) {
    try {
        const book = await Book.findById(req.params.id);
        const sale = book.sales.id(req.params.saleId);
        if (!sale) return res.status(404).send('Sale not found');
        sale.year = req.body.year;
        sale.sales = req.body.sales;
        await book.save();

        if (process.env.USE_CACHE === 'true') {
            await delCache('books_all');
            console.log('[CACHE DEL] books_all');
            await delCache(`book:${book._id}`);
            console.log(`[CACHE DEL] book:${book._id}`);
            await delCache(`book_reviews:${book._id}`);
            console.log(`book_reviews:${book._id}`);
            await delCache('authors_stats');
            console.log('[CACHE DEL] authors_stats');
        }

        res.redirect(`/books/${book._id}/edit`);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

async function deleteSaleWeb(req, res) {
    try {
        const book = await Book.findById(req.params.id);
        // Try Mongoose subdoc remove
        const saleSubdoc = book.sales.id(req.params.saleId);
        if (saleSubdoc && typeof saleSubdoc.remove === 'function') {
            saleSubdoc.remove();
        } else {
            // Fallback: filter out by _id
            book.sales = book.sales.filter(s => s._id?.toString() !== req.params.saleId);
        }
        await book.save();

        if (process.env.USE_CACHE === 'true') {
            await delCache('books_all');
            console.log('[CACHE DEL] books_all');
            await delCache(`book:${book._id}`);
            console.log(`[CACHE DEL] book:${book._id}`);
            await delCache(`book_reviews:${book._id}`);
            console.log(`book_reviews:${book._id}`);
            await delCache('authors_stats');
            console.log('[CACHE DEL] authors_stats');
        }

        res.redirect(`/books/${book._id}/edit`);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// --- Web CRUD methods ---

const Author = require('../models/Author');

// Render new book form
async function renderNewBookForm(req, res) {
    const authors = await Author.find({});
    res.render('booksForm', { book: {}, authors, action: '/books', method: 'POST', title: 'Add Book' });
}

// Create book from web form
async function createBookWeb(req, res) {
    try {
        const bookData = req.body;
        if (req.file) {
            bookData.coverImage = req.file.filename;
        }

        const book = new Book(bookData);
        await book.save();
        res.redirect('/books');
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Render edit book form
async function renderEditBookForm(req, res) {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).send('Book not found');
        const authors = await Author.find({});
        res.render('booksForm', { book, authors, action: `/books/${book._id}`, method: 'POST', title: 'Edit Book' });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Update book from web form
async function updateBookWeb(req, res) {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).send('Book not found');

        const updateData = req.body;

        // If a new image was uploaded, update it and remove old one
        if (req.file) {
            // Delete old image if it exists
            if (book.coverImage) {
                const oldImagePath = path.join(__dirname, '..', 'uploads', book.coverImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            updateData.coverImage = req.file.filename;
        }

        await Book.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/books');
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Delete book from web
async function deleteBookWeb(req, res) {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.redirect('/books');
    } catch (err) {
        res.status(500).send(err.message);
    }
}