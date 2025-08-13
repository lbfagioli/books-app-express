const express = require('express');
const router = express();
const homeController = require('./controllers/homeController');

router.get('/', homeController.getHome);

module.exports = router;