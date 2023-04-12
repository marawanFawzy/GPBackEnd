const express = require('express');
const doctorController = require('../controllers/doctor')
const auth = require('../middleware/is-auth')

const router = express.Router();
router.get('/main', auth.check, doctorController.home)
router.post('/addRecord', auth.check, doctorController.addRecord)

module.exports = router