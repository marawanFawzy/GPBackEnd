require("dotenv").config();
const path = require('path')
const bcryptjs = require("bcryptjs");
const User = require('../models/users')
const nodemailer = require("nodemailer");
let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
    }
});



exports.LoginPage = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    res.render('login', {
        pageTitle: 'login page',
        path: '/login',
        isAuthenticated: req.session.isLoggedIn
    });
};
exports.OTPPage = (req, res, next) => {
    console.log(req.session);
    res.render('OTP-page', {
        pageTitle: 'OTP page',
        path: '/otp',
        isAuthenticated: req.session.isLoggedIn
    });
};
exports.registerPage = (req, res, next) => {
    console.log(req.session);
    res.render('register', {
        pageTitle: 'register page',
        path: '/register',
        isAuthenticated: req.session.isLoggedIn
    });
};
exports.registerPost = (req, res, next) => {


    bcryptjs.hash(req.body.password, 10, async (error, hashedpassword) => {
        if (error) {
            return res.status(401).redirect('/register')
        }
        User.findOne({ username: req.body.username })
            .then(user => {
                if (user) {
                    if (user.username === req.body.username) {
                        console.log("username is used")
                        return res.status(401).redirect('/register')
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
                            return res.status(200).redirect('/login')
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
    console.log(req.body);
    const code = req.body.code;
    if (code == req.session.number) {
        delete req.session.number;
        req.session.isLoggedIn = true;
        if (!req.session.isAdmin) {
            res.redirect('/')
        }
        else {
            res.redirect('/admin')
        }

    }
    else if (code === 60000) {
        delete req.session.number;



    }
    else
        return res.status(401).redirect('/otp')
};
exports.Postlogin = (req, res, next) => {
    console.log(req.body);
    const password = req.body.password
    User.findOne({ username: req.body.username })
        .then(user => {
            if (user)
                bcryptjs.compare(password, user.password)
                    .then((correct) => {
                        if (correct) {
                            req.session.number = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
                            if (user.flag)
                                req.session.isAdmin = true;
                            else
                                req.session.isAdmin = false;
                            const d = new Date();
                            let options = {
                                from: process.env.MAIL,
                                to: user.mail,
                                subject: 'OTP',
                                text: req.session.number + ' this OTP expires after 10 minutes at ' + new Date(d.getTime() + 60000)
                            }
                            transport.sendMail(options, (err, data) => {
                                if (err)
                                    console.log(err)
                                else {
                                    console.log("sent")
                                }
                            })
                            return res.status(401).redirect('/otp')
                        } else {
                            return res.status(401).redirect('/login')
                        }
                    });
            else {
                return res.status(401).redirect('/login')
            }
        }
        ).catch(err => {
            console.log(err);
        })
};
exports.logOut = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/login')
    });
};