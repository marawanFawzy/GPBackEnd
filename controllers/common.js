require("dotenv").config();
const bcryptjs = require("bcryptjs");
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
    }
})

exports.login = (req, res, next) => {
    console.log("login")
    const password = req.body.password
    const email = req.body.email
    if (email && password == 'mmm') { // correct password
        Atoken = jwt.sign(
            {
                email: email,
                id: 1,
                refreshOnly: false,
            }, 'someStrongKey',
            { expiresIn: '24h' }
        )
        console.log(email)
        if (email == "marawa.fawzy@gmail.com") {
            req.session.admin = true
            req.session.loggedIn = false
        }
        else {
            req.session.loggedIn = true
            req.session.admin = false
        }

        res.status(200).json({ code: 200, Atoken: Atoken, success: true, email: email, admin: req.session.admin })
    }
    else {
        console.log("wrong")
        req.session.loggedIn = false
        res.status(401).json({ code: 403, success: false })

    }
};

exports.ResetPassword = (req, res, next) => {
    console.log(req.body.email)
    number = Math.round(Math.floor(Math.random() * 999999 - 1000000 + 1) + 1000000)
    transport.sendMail({
        from: process.env.MAIL,
        to: req.body.email,
        subject: 'password reset',
        text: 'the code to reset your password is ' + number
    }, (err, data) => {
        if (err)
            res.status(500).json({
                success: false,
                code: 500,
            })
        else {
            Rtoken = jwt.sign(
                {
                    email: req.body.email,
                    id: 1,
                    refreshOnly: true,
                }, 'someStrongKey',
                { expiresIn: '1h' }
            )
            req.session.number = number;
            req.session.changePassword = true;
            console.log(req.session)
            res.status(200).json({
                success: true,
                code: 200,
                Rtoken: Rtoken
            })
        }
    })
}
exports.ConfirmCode = (req, res, next) => {
    console.log(req.body.number)
    console.log(req.session)
    try {
        Rtoken = req.get('Authorization').split(' ')[1]
        number = req.body.number
        confirmNumber = req.session.number
        const decodeToken = jwt.verify(Rtoken, 'someStrongKey');
        email = decodeToken.email
        console.log(decodeToken.refreshOnly)
        if (decodeToken.refreshOnly && req.session.changePassword) {
            if (number == confirmNumber) {// from database 
                res.status(200).json({
                    success: true,
                    code: 200,
                    email: email,
                })
            }
            else {
                res.status(403).json({
                    success: false,
                    code: 403,

                })
            }
        }
        else {
            res.status(401).json({
                success: false,
                code: 401,

            })
        }
        //find in database 


    }
    catch (err) {
        res.status(401).json({
            success: false,
            code: 401,
        })
    }

}
exports.changePassword = (req, res, next) => {
    try {
        Rtoken = req.get('Authorization').split(' ')[1]
        newPassword = req.body.newPassword
        const decodeToken = jwt.verify(Rtoken, 'someStrongKey');
        email = decodeToken.email
        //find in database 
        //add to database 
        if (req.session.changePassword) {
            req.session.destroy(() => {
                console.log("destroy")
            })
            res.status(200).json({
                success: true,
                code: 200,
            })
        }
        else throw new Error()


    }
    catch (err) {
        res.status(401).json({
            success: false,
            code: 401,
        })
    }

}