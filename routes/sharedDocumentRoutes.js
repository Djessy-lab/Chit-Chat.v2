const express = require('express');
const router = express.Router();
const { createSharedDocument, getAllSharedDocuments } = require('../controllers/sharedDocumentController');

router.post('/', createSharedDocument);

router.get('/', getAllSharedDocuments);


module.exports = router;
