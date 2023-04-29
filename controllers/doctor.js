const User = require('../models/users')
const Alert = require('../models/alerts')
const Patient = require('../models/patients')
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
        User.findOne(req.email)
            .then(([result, meta]) => {
                if (result[0]) {
                    res.status(req.code).json({
                        code: req.code,
                        success: true,
                        researcher: result[0]['is_researcher'],
                        doctor: result[0]['is_doctor'],
                        observer: result[0]['is_observer'],
                    })
                }
                else
                    throw new Error()
            }).catch((err) => {
                res.status(404).json({
                    code: 404,
                    success: false,
                })
            })

    }
};
exports.addRecord = (req, res, next) => {
    //TODO: add patients to the database and update if exists
    //TODO: add diagnosis to the database
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
    //TODO: get the data to render the dashboards 
    //hint: call flask backend 
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
    Alert.findAll().then(([alerts, meta]) => {
        if (req.code === 401) {
            console.log("no access")
            res.status(req.code).json({
                code: req.code,
                success: false,
            })
        }
        else {
            User.findOne(req.email)
                .then(([result, meta]) => {
                    if (result[0]) {
                        res.status(req.code).json({
                            code: req.code,
                            success: true,
                            researcher: result[0]['is_researcher'],
                            doctor: result[0]['is_doctor'],
                            observer: result[0]['is_observer'],
                            alerts: alerts
                        })
                    }
                    else
                        throw new Error()
                }).catch((err) => {
                    res.status(404).json({
                        code: 404,
                        success: false,
                    })
                })

        }
    }).catch((err) => {
        console.log(err)
        res.status(500).json({
            code: 500,
            success: false,
        })
    });


}
exports.alert = (req, res, next) => {
    //TODO:fetch single alert (discuss with pola)
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
