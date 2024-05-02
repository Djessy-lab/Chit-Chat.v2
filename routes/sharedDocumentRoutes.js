const express = require('express');
const router = express.Router();
const { createSharedDocument, getAllSharedDocuments, deleteDocument } = require('../controllers/sharedDocumentController');

router.post('/', createSharedDocument);

router.get('/', getAllSharedDocuments);

router.delete('/:id', deleteDocument);


module.exports = router;
