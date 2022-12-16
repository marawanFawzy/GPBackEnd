const express = require('express');
const userController = require('../controllers/user')

const router = express.Router();

router.get('/home', userController.home)
module.exports = router