const express = require('express');
const router = express.Router();
const dailyTransmissionController = require('../controllers/dailyTransmissionController');

router.post('/', dailyTransmissionController.createDailyTransmission);
router.get('/', dailyTransmissionController.getAllDailyTransmissions);
router.get('/:id', dailyTransmissionController.getDailyTransmissionById);
router.delete('/:userId/:id', dailyTransmissionController.deleteDailyTransmission);


module.exports = router;
