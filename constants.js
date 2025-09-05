const mongoURI = "mongodb://db:27017/books-app-db";
const PORT = 3000;
let USE_CACHE = true;

module.exports = {
    mongoURI,
    PORT,
    serveStatic: process.env.SERVE_STATIC === 'true',
    USE_CACHE
}