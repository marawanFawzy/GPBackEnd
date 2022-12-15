const express = require('express');

const router = express.Router();

router.get('/admin', (req, res, next) => {
    console.log("admin");
    res.status(200).send("<h1>admin</h1>");
})
module.exports = router