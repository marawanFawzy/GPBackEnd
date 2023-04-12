const express = require('express');
const path = require('path')
const adminController = require('../controllers/admin.js');
const router = express.Router();
const auth = require('../middleware/is-auth.js')

router.get('/download?:image_name', auth.adminCheck, adminController.downloadFile)
router.post('/addDoctor', auth.adminCheck, adminController.addDoctor)
router.get('/admin', auth.adminCheck, adminController.admin)
module.exports = router