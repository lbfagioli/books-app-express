const mongoose = require('mongoose');
const Book = require('./models/Book');
const Author = require('./models/Author');

mongoose.connect('mongodb://localhost:27017/books-app-db');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const firstNames = ["John", "Mary", "Alice", "Robert", "Laura", "James", "Emma", "William", "Sophia", "David"];
const lastNames = ["Smith", "Johnson", "Brown", "Taylor", "Anderson", "Martinez", "Thompson", "Garcia", "Wilson", "Lee"];

async function seedDatabase() {
    await Author.deleteMany({});
    await Book.deleteMany({});

    // 50 autores
    const authors = [];
    for (let i = 0; i < 50; i++) {
        const author = new Author({
            name: `${firstNames[getRandomInt(0, firstNames.length - 1)]} ${lastNames[getRandomInt(0, lastNames.length - 1)]}`,
            bio: `This is the biography of author ${i + 1}`,
            birthdate: new Date(1950 + getRandomInt(0, 50), getRandomInt(0, 11), getRandomInt(1, 28))
        });
        await author.save();
        authors.push(author);
    }

    // 300 libros
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
            author: randomAuthor._id   // author relation
        });

        await book.save();
    }

    console.log("Database seeded");
    mongoose.connection.close();
}

seedDatabase();
