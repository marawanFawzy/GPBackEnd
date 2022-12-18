const path = require('path')
const bcryptjs = require("bcryptjs");
const User = require('../models/users')

exports.LoginPage = (req, res, next) => {
    console.log("login");
    console.log(req.session.isLoggedIn);
    res.render('login', {
        pageTitle: 'login page',
        path: '/login',
        isAuthenticated: req.session.isLoggedIn
    });
};
exports.OTPPage = (req, res, next) => {
    console.log("otp page");
    console.log(req.session.isLoggedIn);
    res.render('OTP-page', {
        pageTitle: 'OTP page',
        path: '/otp',
        isAuthenticated: req.session.isLoggedIn
    });
};
exports.registerPage = (req, res, next) => {
    console.log("register");
    console.log(req.session.isLoggedIn);
    res.render('register', {
        pageTitle: 'register page',
        path: '/register',
        isAuthenticated: req.session.isLoggedIn
    });
};
exports.registerPost = (req, res, next) => {
    bcryptjs.hash(req.body.password, 16, async (error, hashedpassword) => {
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
                            console.log("done")
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
    console.log("confirm OTP");
    console.log(req.body);
    const code = req.body.code;
    
    if (code === 'admin') {
        req.session.isLoggedIn = true;
        req.session.isAdmin = true;
        res.redirect('/admin')
    }
    else if (code === 'test') {
        req.session.isLoggedIn = true;
        req.session.isAdmin = false;
        res.redirect('/')
    }
    else
        return res.status(401).redirect('/otp')
};
exports.Postlogin = (req, res, next) => {
    console.log("checkuser");
    console.log(req.body);
    const password = req.body.password
    User.findOne({ username: req.body.username })
        .then(user => {
            if (user)
                bcryptjs.compare(password, user.password)
                    .then((correct) => {
                        if (correct) {
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
exports.logOut = (req, res,next) =>{
    req.session.destroy(()=>{
        console.log('out');
        res.redirect('/login')
    });
};