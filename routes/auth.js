const express = require('express');
const rateLimit = require("express-rate-limit")
const path = require('path')

const router = express.Router();

const loginlimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 1 minutes
    max: 3, // Limit each IP to 3 requests per `window` (here, per 1 minute)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'You have exceeded the 3 requests in login please wait 10 minutes',
})

router.get('/login', (req, res, next) => {
    console.log("login");
    res.status(200).sendFile(path.join(__dirname, '../', 'views', 'login.html'));
})
router.get('/otp', (req, res, next) => {
    console.log("otp page");
    res.status(200).send("<h1>otp page</h1>");
})
router.get('/register', (req, res, next) => {
    console.log("register");
    res.status(200).sendFile(path.join(__dirname, '../', 'views', 'register.html'));
})
router.post('/adduser', (req, res, next) => {
    console.log("otp");
    res.status(200).send("<h1>registered</h1>");
})
router.post('/confirm/otp', loginlimiter, (req, res, next) => {
    console.log("otp");
    res.status(200).send("<h1>OTP</h1>");
})
router.post('/checkUser', loginlimiter, (req, res, next) => {
    console.log("login");
    console.log(req.body);
    const password = req.body.password;
    if (password === 'test')
        res.status(202).sendFile(path.join(__dirname, '..', 'views', 'home.html'));
    else
        res.status(401).sendFile(path.join(__dirname, '..', 'views', 'login.html'));
})



module.exports = router