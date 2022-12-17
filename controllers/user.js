const path = require('path')
exports.home = (req, res, next) => {
    console.log("home");
    res.render('home', {
        pageTitle: 'home page',
        name: 'marawan',
        path: '/home'
    });
};