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

    //TODO: find in database then send the data to search page as response then it forwords this data to the view
    console.log(req.body)
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
exports.addDoctor = (req, res, next) => {
    const data = req.body
    try {
        bcryptjs.hash(data.Nid, 10, async (error, hashedpassword) => {
            if (error) {
                console.log(error)
                req.code = 500
                throw new Error()
            }
            const newUser = new User(data.Fname, hashedpassword, data.Lname, data.Nid, "test temp spec", data.gender, "mareel.sena@gmail.com", 1, 1, data.researcher, data.doctor, data.observer)
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
        })
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
    //TODO: get the data then send it to update the user in the database 
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