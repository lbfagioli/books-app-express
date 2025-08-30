const mongoURI = "mongodb://db:27017/books-app-db";
const PORT = 3000;

module.exports = {
    mongoURI,
    PORT,
    uploadPath: process.env.UPLOAD_PATH || 'uploads', // default to local uploads folder
    serveStatic: process.env.SERVE_STATIC === 'true'
}