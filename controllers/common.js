require("dotenv").config();
const bcryptjs = require("bcryptjs");
const User = require('../models/users')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
    }
})


exports.OTP = (req, res, next) => {
    const code = req.body.code;
    if (code == req.session.number) {
        delete req.session.number
        req.session.cookie.expires = 1000 * 60 * 60 * 24
        req.session.isLoggedIn = true;
        if (!req.session.isAdmin) {
            res.status(200).redirect('/')
        }
        else {
            res.status(200).redirect('/admin')
        }
    }
    else
        return res.status(401).render('OTP-page', {
            pageTitle: 'OTP page',
            path: '/otp',
            isAuthenticated: req.session.isLoggedIn
        });
};
exports.login = (req, res, next) => {
    const password = req.body.password
    const email = req.body.email
    if (email && password == 'mmm') { // correct password
        token = jwt.sign(
            {
                email: email,
                id: 1
            }, 'key',
            { expiresIn: '1h' }
        )
        console.log(email)
        res.status(200).json({ token: token, success: true, email: email })
    }
    else {
        res.status(401).json({ success: false })

    }
};
exports.logOut = (req, res, next) => {
    req.session.destroy(() => {
        res.render('login', {
            pageTitle: 'login page',
            path: '/login',
            isAuthenticated: false
        });
    });
};