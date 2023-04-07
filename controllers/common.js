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


exports.LoginPage = (req, res, next) => {
    res.status(200).json({ code: '403', pageTitle: 'this is login page', isAuthenticated: req.session.isLoggedIn, isAdmin: req.session.isAdmin });
};
exports.OTPPage = (req, res, next) => {
    res.render('OTP-page', {
        pageTitle: 'OTP page',
        path: '/otp',
        isAuthenticated: req.session.isLoggedIn
    });
};
exports.registerPage = (req, res, next) => {
    res.render('register', {
        pageTitle: 'register page',
        path: '/register',
        isAuthenticated: req.session.isLoggedIn
    });
};
exports.registerPost = (req, res, next) => {
    bcryptjs.hash(req.body.password, 16, async (error, hashedpassword) => {
        if (error) {
            return res.status(422).render('register', {
                pageTitle: 'register page',
                path: '/register',
                isAuthenticated: req.session.isLoggedIn
            });
        }
        User.findOne({ username: req.body.username }) //
            .then(user => {
                if (user) {
                    if (user.username === req.body.username) {
                        console.log("username is used")
                        return res.status(302).render('register', {
                            pageTitle: 'register page',
                            path: '/register',
                            isAuthenticated: req.session.isLoggedIn
                        });
                    }
                }
                else {
                    const newUser = new User({
                        name: req.body.name,
                        username: req.body.username,
                        mail: req.body.mail,
                        password: hashedpassword,
                    })
                    newUser.save()
                        .then(result => {
                            return res.status(200).render('login', {
                                pageTitle: 'login page',
                                path: '/login',
                                isAuthenticated: req.session.isLoggedIn
                            });
                        }).catch(err => {
                            console.log(err)
                        });
                }
            }).catch(err => {
                console.log(err);
            });
    });

};
exports.OTPPost = (req, res, next) => {
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
exports.Postlogin = (req, res, next) => {
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