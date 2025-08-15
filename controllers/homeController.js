exports.getHome = (req, res) => {
    res.render('home', { title: 'Welcome to Book Review App' });
};
