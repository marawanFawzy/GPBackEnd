const express = require('express');
const adminController = require('../controllers/admin.js');
const router = express.Router();
const auth = require('../middleware/is-auth.js')

router.get('/download?:image_name', auth.adminCheck, adminController.downloadFile)

router.get('/admin', auth.adminCheck, adminController.adminPages)
router.get('/loadDoctorData?:Nid', auth.adminCheck, adminController.loadDoctorData)
router.post('/addDoctor', auth.adminCheck, adminController.addDoctor)
router.post('/search', auth.adminCheck, adminController.search)
router.post('/editDoctor', auth.adminCheck, adminController.editdoc)
// added as example to communicate between flask and node
router.get('/predict', adminController.predict)
module.exports = router