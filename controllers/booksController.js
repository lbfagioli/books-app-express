exports.getBooks = (req, res) => {
    res.send('getting books');
}

exports.getBook = (req, res) => {
    res.send(`getting book ${req.params.id}`);
}

exports.createBook = (req, res) => {
    res.send('creating book');
}

exports.updateBook = (req, res) => {
    res.send(`updating book ${req.params.id}`);
}

exports.deleteBook = (req, res) => {
    res.send(`deleting book ${req.params.id}`);
}