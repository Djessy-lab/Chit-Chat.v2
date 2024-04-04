const express = require('express');
const { updateUser, getUser, createUser } = require('../controllers/userController');
const router = express.Router();

router.put('/update-user/:id', updateUser);
router.get('/get-user/:id', getUser);
router.post('/create-user', createUser);

module.exports = router;
