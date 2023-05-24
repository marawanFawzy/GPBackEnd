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
exports.dynamicData = (req, res, next) => {
    //TODO: get the data to render the dashboards 
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
            code: 200,
            dateMonth: '2016/2017',
            dateMonth2: '2018/2019',
            dataMonth: [50, 23, 55, 60, 90, 90, 67, 69, 50, 58, 36, 54],
            dataMonth2: [90, 74, 73, 97, 92, 80, 77, 100, 77, 85, 37, 54],
            dateWeeks: '2016/2017',
            dateWeeks2: '2018/2019',
            dataWeeks: [50, 23, 55, 54, 90, 90, 67, 69, 50, 58, 36, 54, 50, 23, 55, 54, 90, 90, 67, 69, 50, 58, 36, 54, 50, 23, 55, 54, 90, 90, 67, 69, 50, 58, 36, 54, 50, 23, 55, 54, 90, 90, 67, 69, 50, 58, 36, 54, 30, 24, 14, 16],
            dataWeeks2: [90, 74, 73, 97, 92, 80, 77, 100, 77, 85, 37, 54, 90, 74, 73, 97, 92, 80, 77, 100, 77, 85, 37, 54, 90, 74, 73, 97, 92, 80, 77, 100, 77, 85, 37, 54, 90, 74, 73, 97, 92, 80, 77, 100, 77, 85, 37, 54, 67, 89, 23, 124]
        })
    }
}
exports.staticData = (req, res, next) => {
    //TODO: get the data to render the dashboards 
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
            code: 200,
            gender: [400, 300],
            age: [160, 320, 268, 472, 104],
            numebrOfCases: 40,
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
    //WAIT:fetch single alert (discuss with pola)
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
