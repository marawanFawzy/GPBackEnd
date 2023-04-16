const doctor = require('../models/doctors')
const path = require('path')
const fs = require('fs')
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
    console.log("search for doctor")
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
    console.log("add doctor")
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
exports.editdoc = (req, res, next) => {
    console.log("doctor data changed")
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