const express = require('express');
const likeController = require('../controllers/likeController');
const router = express.Router();

router.post('/:postId/likes', likeController.addLike);
router.delete('/:postId/likes', likeController.removeLike);
router.get('/:postId/check-like', likeController.checkLike);
module.exports = router;
