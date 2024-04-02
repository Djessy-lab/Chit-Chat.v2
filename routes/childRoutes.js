const express = require('express');
const { getChild, getChildren, createChild, updateChild, deleteChild } = require('../controllers/childController');
const router = express.Router();

router.get('/', getChildren);

router.get('/:id', getChild);

router.post('/', createChild);

router.put('/:id', updateChild);

router.delete('/:id', deleteChild);

module.exports = router;
