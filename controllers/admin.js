const User = require('../models/users')
exports.adminPage = (req, res, next) => {
    User.findOne({ username: req.session.username }).then(user => {
        res.render('admin', {
            pageTitle: 'admin page',
            name: user.name,
            path: '/admin',
            isAuthenticated: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin,
        });
    }).catch(err => {
        console.log(err);
    })

}