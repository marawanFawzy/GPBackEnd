const express = require('express');
const doctorController = require('../controllers/doctor')
const auth = require('../middleware/is-auth')

const router = express.Router();
router.get('/main', auth.check, doctorController.userPages)
router.get('/dynamicData', auth.check, doctorController.dynamicData)
router.get('/staticData', auth.check, doctorController.staticData)
router.get('/alerts', auth.check, doctorController.alerts)
router.get('/alert?:id', auth.check, doctorController.alert)
router.post('/addRecord', auth.check, doctorController.addRecord)


module.exports = router