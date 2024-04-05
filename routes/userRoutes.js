const express = require('express');
const { updateUser, getUser, createUser } = require('../controllers/userController');
const router = express.Router();

router.put('/update-user/:uid', updateUser);
router.get('/get-user/:uid', getUser);
router.post('/create-user', createUser);

module.exports = router;
