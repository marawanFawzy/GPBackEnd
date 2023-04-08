const express = require('express');
const doctorController = require('../controllers/doctor')
const auth = require('../middleware/is-auth')

const router = express.Router();
router.get('/main',auth.requestpage, doctorController.home)
router.post('/upload', doctorController.upload)

module.exports = router