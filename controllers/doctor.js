const User = require('../models/users')
const path = require('path')
const fs = require('fs')
exports.userPages = (req, res, next) => {
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
        })
    }
};
exports.addRecord = (req, res, next) => {
    console.log("add record")
    if (req.code === 401) {
        console.log("no access")
        res.status(req.code).json({
            code: req.code,
            success: false,

        })
    }
    else {
        console.log(req.body)
        res.status(200).json({
            success: true,
            code: 200
        })
    }
}
exports.dashboard = (req, res, next) => {
    console.log("dashboard")
    if (req.code === 401) {
        console.log("no access")
        res.status(req.code).json({
            code: req.code,
            success: false,

        })
    }
    else {
        console.log(req.body)
        res.status(200).json({
            success: true,
            code: 200
        })
    }
}
exports.alerts = (req, res, next) => {
    console.log("alerts")
    if (req.code === 401) {
        console.log("no access")
        res.status(req.code).json({
            code: req.code,
            success: false,

        })
    }
    else {
        res.status(200).json({
            success: true,
            code: 200
        })
    }
}
exports.alert = (req, res, next) => {
    console.log("alert")
    if (req.code === 401) {
        console.log("no access")
        res.status(req.code).json({
            code: req.code,
            success: false,

        })
    }
    else {
        console.log(req.params)
        res.status(200).json({
            success: true,
            code: 200
        })
    }
}
