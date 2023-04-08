const User = require('../models/doctors')
const path = require('path')
const fs = require('fs')
exports.home = (req, res, next) => {
    if (req.code === 401) {
        console.log("no access")
        res.status(req.code).json({
            success: false,
            
        })
    }
    else {
        console.log("this is home")
        res.status(req.code).json({
            email: req.email,
            // find and return level 
            success: true,
            researcher : false,
            doctor : true,
            observer : false,
            admin : true,
        })
    }
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
