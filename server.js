const express = require('express');
const app = express();
const PORT = 3000;
const routes = require('./routes');

// app.get('/', (req, res) => {
//     res.send("heelo");
// });

app.use('/', routes);

app.listen(PORT, () => {
    console.log('Server started, receiving requests...');
});