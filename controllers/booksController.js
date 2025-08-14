const getBooks = (req, res) => {
    res.send('getting books');
}

const getBook = (req, res) => {
    res.send(`getting book ${req.params.id}`);
}

const createBook = (req, res) => {
    res.send('creating book');
}

const updateBook = (req, res) => {
    res.send(`updating book ${req.params.id}`);
}

const deleteBook = (req, res) => {
    res.send(`deleting book ${req.params.id}`);
}

module.exports = {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
}