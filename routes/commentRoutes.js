const express = require('express');
const commentController = require('../controllers/commentController');
const router = express.Router();

router.post('/:postId/comments', commentController.addComment);
router.get('/:postId/comments', commentController.getComments);
router.delete('/comments/:commentId', commentController.deleteComment);

module.exports = router;
