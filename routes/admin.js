const express = require('express');
const path = require('path')

const router = express.Router();

router.get('/admin', (req, res, next) => {
    console.log("admin");
    res.status(200).sendFile(path.join(__dirname, '..', 'views', 'admin.html'));
})
module.exports = router