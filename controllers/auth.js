const path = require('path')
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
    console.log("user added");
    res.render('login', {
        pageTitle: 'login page',
        path: '/login',
    });
};
exports.confirmOTP = (req, res, next) => {
    console.log("confirm OTP");
    console.log("checkuser");
    console.log(req.body);
    const code = req.body.code;
    if (code === 'test')
        res.redirect('/home')
    else
        res.redirect('/otp')
};
exports.checkuser = (req, res, next) => {
    console.log("checkuser");
    console.log(req.body);
    const password = req.body.password;
    if (password === 'test')
        res.redirect('/otp')
    else
        res.redirect('/login')
};