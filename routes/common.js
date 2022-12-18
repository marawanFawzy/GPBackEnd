const express = require('express');
const rateLimit = require("express-rate-limit")
const authController = require('../controllers/common')
const path = require('path')

const router = express.Router();

const loginlimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 1 minutes
    max: 3, // Limit each IP to 3 requests per `window` (here, per 1 minute)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'You have exceeded the 3 requests in login please wait 10 minutes',
})
const OTPLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 1 minutes
    max: 3, // Limit each IP to 3 requests per `window` (here, per 1 minute)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'You have exceeded the 3 requests in OTP please wait 10 minutes',
})

router.get('/login', authController.LoginPage)
router.post('/login', loginlimiter, authController.Postlogin)
router.get('/otp', authController.OTPPage)
router.post('/otp', OTPLimiter, authController.OTPPost)
router.get('/register', authController.registerPage)
router.post('/register', authController.registerPost)
router.post('/log-out', authController.logOut)



module.exports = router