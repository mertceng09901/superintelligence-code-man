const express = require('express');
const router = express.Router();
const { getReviews, addReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/:productId', getReviews);
router.post('/:productId', protect, addReview);
router.delete('/:reviewId', protect, deleteReview);

module.exports = router;
