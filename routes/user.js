const express = require('express');

const router = express.Router();

router.get('/home', (req, res, next) => {
    console.log("home");
    res.status(200).send("<h1>home</h1>");
})
module.exports = router