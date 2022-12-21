const express = require('express');
const userController = require('../controllers/user')

const router = express.Router();
const isLogged = require('../middleware/logginAuth')
router.get('/', isLogged, userController.home)
router.post('/upload', isLogged, userController.upload)
router.get('/download?:image_name', isLogged, userController.downloadFile)
module.exports = router