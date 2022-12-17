const path = require('path')
const bcryptjs = require("bcryptjs");
const User = require('../models/users')

exports.LoginPage = (req, res, next) => {
    console.log("login");
    res.render('login', {
        pageTitle: 'login page',
        path: '/login',
    });
};
exports.OTPPage = (req, res, next) => {
    console.log("otp page");
    res.render('OTP-page', {
        pageTitle: 'OTP page',
        path: '/otp',
    });
};
exports.registerPage = (req, res, next) => {
    console.log("register");
    res.render('register', {
        pageTitle: 'register page',
        path: '/register'
    });
};
exports.adduser = (req, res, next) => {
    bcryptjs.hash(req.body.password, 16, async (error, hashedpassword) => {
        if (error) {
            return res.status(401).render('register', {
                pageTitle: 'register page',
                path: '/register'
            })
        }
        User.findOne({ username: req.body.username })
            .then(user => {
                if (user){
                    if (user.username === req.body.username) {
                        console.log("username is used")
                        return res.status(401).render('register', {
                            pageTitle: 'register page',
                            path: '/register'
                        })
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
                            return res.render('login', {
                                pageTitle: 'login page',
                                path: '/login',
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
exports.confirmOTP = (req, res, next) => {
    console.log("confirm OTP");
    console.log("checkuser");
    console.log(req.body);
    const code = req.body.code;
    if (code === 'admin')
        return res.redirect('/admin')
    else if (code === 'test')
        return res.redirect('/home')
    else
        return res.redirect('/otp')
};
exports.checkuser = (req, res, next) => {
    console.log("checkuser");
    console.log(req.body);
    const password = req.body.password
    User.findOne({username: req.body.username})
    .then(user=>{
        bcryptjs.compare(password, user.password)
        .then((correct) => {
            if (correct) {
                return res.render('OTP-page', {
                    pageTitle: 'OTP page',
                    path: '/otp',
                });
            } else {
                return res.status(401).render('login', {
                    pageTitle: 'login page',
                    path: '/login',
                });
            }
        });
    }
    ).catch(err=>{
        console.log(err);
    })
    //TODO get hash from database when create it 
    // MARAWAN passes 

};