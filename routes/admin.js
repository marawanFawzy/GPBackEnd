const express = require('express');
const path = require('path')
const adminController = require('../controllers/admin.js');
const router = express.Router();
const auth = require('../middleware/is-auth.js')

router.get('/admin', auth.adminCheck, adminController.adminPages)
router.get('/download?:image_name', auth.adminCheck, adminController.downloadFile)

router.post('/addDoctor', auth.adminCheck, adminController.addDoctor)
router.post('/search', auth.adminCheck, adminController.search)
router.post('/editDoctor', auth.adminCheck, adminController.editdoc)
router.get('/predict', adminController.predict)
module.exports = router