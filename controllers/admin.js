exports.adminPage = (req, res, next) => {
    res.render('admin', {
        pageTitle: 'admin page',
        name: 'marawan',
        path: '/admin',
    });
}