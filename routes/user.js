const express = require('express');
const userController = require('../controllers/user')

const router = express.Router();

router.get('/home', userController.home)
router.post('/upload', userController.upload)
module.exports = router