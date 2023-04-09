const User = require('../models/doctors')
const path = require('path')
const fs = require('fs')
exports.home = (req, res, next) => {
    if (req.code === 401) {
        console.log("no access")
        res.status(req.code).json({
            code: req.code,
            success: false,

        })
    }
    else {
        console.log("this is home")
        res.status(req.code).json({
            email: req.email,
            code: req.code,
            // find and return level 
            success: true,
            researcher: true,
            doctor: true,
            observer: true,
            admin: true,
        })
    }
};
