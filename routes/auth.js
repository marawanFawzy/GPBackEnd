const express = require('express');
const rateLimit = require ("express-rate-limit")

const router = express.Router();

const loginlimiter = rateLimit({
	windowMs:  10* 60 * 1000, // 1 minutes
	max: 3, // Limit each IP to 3 requests per `window` (here, per 1 minute)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'You have exceeded the 3 requests in login please wait 10 minutes',
})

router.get('/login',loginlimiter, (req, res, next) => {
    console.log("login");
    res.status(200).send("<h1>login</h1>");
})
router.get('/otp',loginlimiter, (req, res, next) => {
    console.log("otp page");
    res.status(200).send("<h1>otp page</h1>");
})
router.post('/confirm/otp', (req, res, next) => {
    console.log("otp");
    res.status(200).send("<h1>OTP</h1>");
})
router.post('/register', (req, res, next) => {
    console.log("register");
    res.status(200).send("<h1>register</h1>");
})
module.exports = router