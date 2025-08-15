const mongoose = require('mongoose');
const Book = require('./models/Book');

mongoose.connect('mongodb://127.0.0.1:27017/booksApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedBooks() {
    await Book.deleteMany({});

    for (let i = 1; i <= 300; i++) { // 300 books
        const reviews = [];
        for (let j = 0; j < getRandomInt(1, 10); j++) {
            reviews.push({
                reviewText: `Review ${j+1} for Book ${i}`,
                score: getRandomInt(1, 5),
                upvotes: getRandomInt(0, 50)
            });
        }

        const sales = [];
        const currentYear = new Date().getFullYear();
        for (let y = 0; y < 5; y++) {
            sales.push({
                year: currentYear - y,
                sales: getRandomInt(50, 1000)
            });
        }

        const book = new Book({
            title: `Book ${i}`,
            summary: `Summary for Book ${i}`,
            publicationDate: new Date(2015 + (i % 8), 0, 1),
            reviews,
            sales
        });

        await book.save();
    }

    console.log("Books seeded!");
    mongoose.connection.close();
}

seedBooks();
