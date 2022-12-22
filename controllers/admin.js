const User = require('../models/users')
const path = require('path')
const fs = require('fs')
exports.adminPage = (req, res, next) => {
    if (res.statusCode === 401)
        next()
    else {
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

}
exports.downloadFile = (req, res, next) => {
    console.log(req.query.image_name)
    if (res.statusCode === 401) {
        next()
    }
    else {
        if (req.query.image_name) {
            const normalizedPath = path.normalize(req.query.image_name)
            if (normalizedPath === req.query.image_name) {
                const filePath = path.join('images', req.query.image_name)
                if (fs.existsSync(filePath)) {
                    const file = fs.createReadStream(filePath)
                    res.setHeader('Content-Type', 'application/octet-stream')
                    res.setHeader('Content-Disposition', 'inline;filename="' + req.query.image_name + '"')
                    file.pipe(res)
                }
                else next()
            }
            else {
                res.status(401)
                next()
            }
        }
        else next()
    }
}