const express = require('express');
const path = require('path')
const adminController = require('../controllers/admin.js');
const router = express.Router();

router.get('/admin', adminController.adminPage)
module.exports = router