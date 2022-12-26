const User = require('../models/users')
const path = require('path')
const fs = require('fs')
exports.home = (req, res, next) => {
    User.findOne({ username: req.session.username })
        .then(user => {
            console.log(user.name)
            res.render('home', {
                pageTitle: 'home page',
                name: user.name,
                path: '/',
                isAuthenticated: req.session.isLoggedIn,
                isAdmin: req.session.isAdmin,
            });
        }).catch(err => {
            console.log(err);
        })

};
exports.upload = (req, res, next) => {
    const image = req.file;
    console.log(req.file)
    console.log('test')
    if (!image) {
        return res.status(422).render('home', {
            pageTitle: 'home page',
            name: 'Attached file is not an image.',
            path: '/',
            isAuthenticated: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin,
        });
    }
    else {
        return res.status(201).render('home', {
            pageTitle: 'home page',
            name: 'uploaded',
            path: '/',
            isAuthenticated: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin,
        });
    }
}
