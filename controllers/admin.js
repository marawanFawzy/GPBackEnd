const path = require('path')
exports.adminPage = (req, res, next) => {
    console.log("admin");
    res.render('admin', {
        pageTitle: 'admin page',
        name: 'marawan',
        path: '/admin'
    });
}