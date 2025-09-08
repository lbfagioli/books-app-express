const mongoose = require('mongoose');
const Book = require('./models/Book');
const Author = require('./models/Author');
const { mongoURI } = require('./constants');
const { indexBook, indexReview } = require('./utils/search');

mongoose.connect(mongoURI);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const firstNames = ["John", "Mary", "Alice", "Robert", "Laura", "James", "Emma", "William", "Sophia", "David"];
const lastNames = ["Smith", "Johnson", "Brown", "Taylor", "Anderson", "Martinez", "Thompson", "Garcia", "Wilson", "Lee"];

async function seedDatabase() {
    // Drop the whole database for a clean seed
    await mongoose.connection.dropDatabase();

    // Country and description options
    const countries = ["USA", "UK", "Canada", "Australia", "Germany", "France", "Italy", "Spain", "Brazil", "Japan"];
    const descriptions = [
        "Award-winning author.",
        "Specialist in historical fiction.",
        "Renowned for thrillers.",
        "Children's books expert.",
        "Science fiction pioneer.",
        "Poet and novelist.",
        "Literary critic.",
        "Travel writer.",
        "Fantasy world builder.",
        "Non-fiction specialist."
    ];

    // 50 authors
    const authors = [];
    for (let i = 0; i < 50; i++) {
        const author = new Author({
            name: `${firstNames[getRandomInt(0, firstNames.length - 1)]} ${lastNames[getRandomInt(0, lastNames.length - 1)]}`,
            dateOfBirth: new Date(1950 + getRandomInt(0, 50), getRandomInt(0, 11), getRandomInt(1, 28)),
            country: countries[getRandomInt(0, countries.length - 1)],
            description: descriptions[getRandomInt(0, descriptions.length - 1)]
        });
        await author.save();
        authors.push(author);
    }

    // 300 books
    for (let i = 1; i <= 300; i++) {
        const reviews = [];
        for (let j = 0; j < getRandomInt(1, 10); j++) {
            reviews.push({
                reviewText: `Review ${j + 1} for Book ${i}`,
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

        const randomAuthor = authors[getRandomInt(0, authors.length - 1)];

        const book = new Book({
            title: `Book ${i}`,
            summary: `Summary for Book ${i}`,
            publicationDate: new Date(2010 + (i % 15), 0, 1),
            reviews,
            sales,
            author: randomAuthor._id
        });

        await book.save();
        // Index book in OpenSearch
        try { await indexBook(book); } catch (e) { console.log('[OpenSearch] Index book failed', e); }
        // Index reviews in OpenSearch
        for (const review of book.reviews) {
            try { await indexReview(book._id, review); } catch (e) { console.log('[OpenSearch] Index review failed', e); }
        }
    }

    console.log("Database seeded");
    mongoose.connection.close();
}

seedDatabase();
