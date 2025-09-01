const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { serveStatic } = require('../constants');

// Handles logic for image-based uploads //
const uploadPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// serve uploaded images when app is responsible for static assets
if (serveStatic) {
  app.use('/uploads', express.static(path.join(__dirname, uploadPath)));
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

module.exports = upload;
