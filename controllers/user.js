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
exports.downloadFile = (req, res, next) => {
    console.log(req.query.image_name)
    const normalizedPath = path.normalize(req.query.image_name)
    if (normalizedPath === req.query.image_name) {
        const filePath = path.join('images', req.query.image_name)
        if (fs.existsSync(filePath)) {
            const file = fs.createReadStream(filePath)
            res.setHeader('Content-Type', 'application/octet-stream')
            res.setHeader('Content-Disposition', 'inline;filename="' + req.query.image_name + '"')
            file.pipe(res)
        }
        else {
            next()
        }
    }
    else
        next()
}