// routes/dailyTransmissionRoutes.js
const express = require('express');
const router = express.Router();
const { createDailyTransmission } = require('../controllers/dailyTransmissionController');

router.post('/', createDailyTransmission);

module.exports = router;
