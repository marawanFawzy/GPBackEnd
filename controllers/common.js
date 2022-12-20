require("dotenv").config();
const bcryptjs = require("bcryptjs");
const User = require('../models/users')
const nodemailer = require('nodemailer')
let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
    }
})


exports.LoginPage = (req, res, next) => {
    res.render('login', {
        pageTitle: 'login page',
        path: '/login',
        isAuthenticated: req.session.isLoggedIn
    });
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
    bcryptjs.hash(req.body.password, 10, async (error, hashedpassword) => {
        if (error) {
            return res.status(401).render('register', {
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
                        return res.status(401).render('register', {
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
        req.session.isLoggedIn = true;
        if (!req.session.isAdmin) {
            res.render('home', {
                pageTitle: 'home page',
                name: 'marawan',
                path: '/',
                isAuthenticated: req.session.isLoggedIn,
                isAdmin: req.session.isAdmin,
            });
        }
        else {
            res.render('admin', {
                pageTitle: 'admin page',
                name: 'marawan',
                path: '/admin',
            });
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
    User.findOne({ username: req.body.username })
        .then(user => {
            if (user)
                bcryptjs.compare(password, user.password)
                    .then((correct) => {
                        if (correct) {
                            req.session.number = Math.floor(Math.random() * 999999 - 1000000 + 1) + 1000000
                            const d = new Date();
                            let options = {
                                from: process.env.MAIL,
                                to: user.mail,
                                subject: 'Your OTP',
                                text: 'your OTP is ' + req.session.number + ' this OTP Expires after 10 minutes at ' + new Date(d.getTime() + 600000)
                            }
                            transport.sendMail(options, (err, data) => {
                                if (err)
                                    console.log(err)
                                else
                                    console.log('done')
                            })
                            if (user.flag)
                                req.session.isAdmin = true;
                            else
                                req.session.isAdmin = false;
                            return res.status(200).render('OTP-page', {
                                pageTitle: 'OTP page',
                                path: '/otp',
                                isAuthenticated: req.session.isLoggedIn
                            });
                        } else {
                            return res.status(401).render('login', {
                                pageTitle: 'login page',
                                path: '/login',
                                isAuthenticated: req.session.isLoggedIn
                            });
                        }
                    });
            else {
                return res.status(401).render('login', {
                    pageTitle: 'login page',
                    path: '/login',
                    isAuthenticated: req.session.isLoggedIn
                });
            }
        }
        ).catch(err => {
            console.log(err);
        })
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