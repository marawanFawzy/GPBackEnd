const User = require('../models/users')
const path = require('path')
const fs = require('fs')
const bcryptjs = require("bcryptjs");
const { default: axios } = require('axios')
exports.downloadFile = (req, res, next) => {
    if (res.statusCode === 401) {
        next()
    }
    else {
        //     ../../../../../Untitled Diagram.drawio.png
        //            test.jpeg
        if (req.query.image_name) {
            //    ../Untitled Diagram.drawio.png
            //        test.jpeg
            const normalizedPath = path.normalize(req.query.image_name)
            if (normalizedPath === req.query.image_name) {
                const filePath = path.join('images', req.query.image_name)
                if (fs.existsSync(filePath)) {
                    const file = fs.createReadStream(filePath)
                    res.setHeader('Content-Type', 'application/octet-stream')
                    res.setHeader('Content-Disposition', 'inline;filename="' + req.query.image_name + '"')
                    file.pipe(res)
                }
                else next()
            }
            else {
                res.status(401)
                next()
            }
        }
        else next()
    }
}

exports.search = (req, res, next) => {
    console.log(req.body)
    if (req.code === 200)
        User.findOneByNiD(req.body.Nid)
            .then(([result, meta]) => {
                if (result[0]) {
                    res.status(req.code).json({
                        success: true,
                        code: req.code
                    })
                }
                else {
                    console.log("not found")
                    res.status(404).json({
                        success: false,
                        code: 404
                    })
                }
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json({
                    success: false,
                    code: 500
                })
            });
    else {
        res.status(req.code).json({
            success: false,
            code: req.code
        })
    }
}
exports.adminPages = (req, res, next) => {
    if (req.code === 200) {
        res.status(req.code).json({
            success: true,
            code: req.code
        })
    }
    else {
        res.status(req.code).json({
            success: false,
            code: req.code
        })
    }
}
exports.loadDoctorData = (req, res, next) => {
    User.findOneByNiD(req.params.Nid)
        .then(([result, meta]) => {
            if (!result[0])
                throw new Error()
            else if (req.code === 200) {
                res.status(200).json({
                    success: true,
                    code: 200,
                    data: result[0]
                })
            }
            else {
                res.status(500).json({
                    success: false,
                    code: 500
                })
            }
        })
        .catch((err) => {
            res.status(404).json({
                success: false,
                code: 404
            })
        })
}
exports.addDoctor = (req, res, next) => {
    const data = req.body
    try {
        const newUser = new User(data.Fname, data.Lname, data.Nid, data.specialization, data.gender, data.birth, data.email, data.Hosbital, data.address, data.researcher, data.doctor, data.observer, data.Governorate, data.District)
        newUser.save()
            .then(() => {
                console.log("added")
            })
            .catch((err) => {
                console.log(err)
                req.code = 501
            });
        if (req.code === 200) {
            res.status(req.code).json({
                success: true,
                code: req.code
            })
        }
        else {
            res.status(req.code).json({
                success: false,
                code: req.code
            })
        }
    }
    catch (err) {
        res.status(req.code).json({
            success: false,
            code: req.code,
        })
    }
}
exports.editdoc = (req, res, next) => {
    console.log("doctor data changed")
    console.log(req.body)
    const data = req.body
    if (req.code === 200) {
        const newUser = new User(data.Fname, data.Lname, data.Nid, data.specialization, data.gender, data.birth, data.email, data.Hosbital, data.address, data.researcher, data.doctor, data.observer, data.Governorate, data.District)
        newUser.update()
            .then(([result, meta]) => {
                console.log(result)
                if (result.affectedRows === 1) {
                    console.log("edited")
                    res.status(req.code).json({
                        success: true,
                        code: req.code
                    })
                }
                else
                    res.status(404).json({
                        success: false,
                        code: 404
                    })
            }).catch((err) => {
                console.log(err)
                res.status(500).json({
                    success: false,
                    code: 500
                })
            })
    }
    else {
        res.status(req.code).json({
            success: false,
            code: req.code
        })
    }
}
exports.predict = (req, res, next) => {
    //TEST: trying to connect 2 backends
    axios
        .get(
            "http://localhost:5000/predict",
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            },
        )
        .then(
            (responseJson) => {
                success = responseJson.data.success
                code = responseJson.data.code
                if (success) {
                    console.log(responseJson.data)
                }
                else {
                    console.log("error")
                    console.log(responseJson.data)
                }
                res.json(responseJson.data)
            })
        .catch(
            (error) => {
                console.log(error)
            });
}