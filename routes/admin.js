const express = require('express');
const path = require('path')
const adminController = require('../controllers/admin.js');
const router = express.Router();
const isAdmin = require('../middleware/adminAuth')

router.get('/admin', isAdmin ,adminController.adminPage)
router.get('/download?:image_name', isAdmin, adminController.downloadFile)
module.exports = router