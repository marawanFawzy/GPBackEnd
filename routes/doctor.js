const express = require('express');
const doctorController = require('../controllers/doctor')
const auth = require('../middleware/is-auth')

const router = express.Router();
router.get('/main', auth.check, doctorController.userPages)
router.get('/dynamicData/:year1/:year2', auth.check, doctorController.dynamicData)
router.get('/staticData', auth.check, doctorController.staticData)
router.get('/alerts', auth.check, doctorController.alerts)
router.get('/alert/:id', auth.check, doctorController.alert)
router.get('/loadMyProfile', auth.check, doctorController.loadMyProfile)
router.get('/getGovernorates', doctorController.getGovernorates)
router.get('/getDistricts?:Governorate', doctorController.getDistricts)
router.post('/addRecord', auth.check, doctorController.addRecord)


module.exports = router