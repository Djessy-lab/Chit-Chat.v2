// routes/dailyTransmissionRoutes.js
const express = require('express');
const router = express.Router();
const { createDailyTransmission, getAllDailyTransmissions, getDailyTransmissionById, } = require('../controllers/dailyTransmissionController');

router.post('/', createDailyTransmission);
router.get('/', getAllDailyTransmissions);
router.get('/:id', getDailyTransmissionById);

module.exports = router;
