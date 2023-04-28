require("dotenv").config();
const bcryptjs = require("bcryptjs");
const User = require("../models/users");
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
    //TODO: compare password with hashed password
    User.findOne(email)
        .then(([result, meta]) => {
            if (result[0] && password == result[0]["pass"]) { // correct password
                Atoken = jwt.sign(
                    {
                        email: email,
                        id: 1,
                        refreshOnly: false,
                    }, 'someStrongKey',
                    { expiresIn: '24h' }
                )
                //TODO: change and get admins from the database not hard coded
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
            else
                throw new Error()
        }).catch((err) => {
            console.log("wrong")
            req.session.loggedIn = false
            res.status(401).json({ code: 403, success: false })
        })

};

exports.ResetPassword = (req, res, next) => {
    User.findOne(req.body.email)
        .then(([result, meta]) => {
            if (result[0])
                console.log("found")
            else
                throw new Error()
            number = Math.round(Math.floor(Math.random() * 999999 - 1000000 + 1) + 1000000)
            transport.sendMail({
                from: process.env.MAIL,
                to: req.body.email,
                subject: 'password reset',
                text: 'the code to reset your password is ' + number
            },
                (err, data) => {
                    if (err)
                        throw new Error()
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
                            Rtoken: Rtoken,

                        })
                    }
                })
        })
        .catch((err) => {
            console.log("not found")
            res.status(500).json({
                success: false,
                code: 500,
            })
        });
}
exports.ConfirmCode = (req, res, next) => {
    console.log(req.body.number)
    try {
        Rtoken = req.get('Authorization').split(' ')[1]
        const decodeToken = jwt.verify(Rtoken, 'someStrongKey');
        email = decodeToken.email
        if (decodeToken.refreshOnly && req.session.changePassword) {
            if (req.body.number == req.session.number) {
                res.status(200).json({
                    success: true,
                    code: 200,
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
        const decodeToken = jwt.verify(Rtoken, 'someStrongKey');
        email = decodeToken.email
        User.findOne(email)
            .then(([result, meta]) => {
                if (result[0]) {
                    const foundUser = new User()
                    foundUser.email = email
                    //TODO: hash password
                    foundUser.updatePassword(req.body.newPassword)
                        .then(([result, meta]) => {
                            if (result["changedRows"] != 0 && req.session.changePassword) {
                                console.log("updated")
                                req.session.destroy(() => {
                                    console.log("destroy session")
                                })
                                res.status(200).json({
                                    success: true,
                                    code: 200,
                                })
                            }
                            else
                                throw new Error()
                        }).catch((err) => {
                            console.log(1)
                            res.status(500).json({
                                success: false,
                                code: 500,
                            })
                        })
                }
                else
                    throw new Error()

            }).catch((err) => {
                console.log(2)
                res.status(404).json({
                    success: false,
                    code: 404,
                })
            });
    }
    catch (err) {
        console.log(3)
        res.status(401).json({
            success: false,
            code: 401,
        })
    }

}
exports.logOut = (req, res, next) => {
    req.session.destroy(function (err) {
        if (err) {
            res.json({
                success: false,
                code: 500,
            });
        } else {
            console.log("logged out");
            res.json({
                success: true,
                code: 200,
            });
        }
    })
}