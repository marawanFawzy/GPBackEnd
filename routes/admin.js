const express = require('express');
const path = require('path')
const adminController = require('../controllers/admin.js');
const router = express.Router();
const isAuth = require('../middleware/is-auth.js')

router.get('/download?:image_name', isAuth.requestpage, adminController.downloadFile)
module.exports = router