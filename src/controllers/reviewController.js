const Review = require('../models/Review');

// Ürüne ait yorumları getir
exports.getReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });

        const avgRating = reviews.length
            ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
            : 0;

        res.json({ reviews, avgRating: Number(avgRating), totalReviews: reviews.length });
    } catch (error) {
        res.status(500).json({ message: 'Yorumlar yüklenemedi', error: error.message });
    }
};

// Yorum ekle
exports.addReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id || req.user.id;
        const userName = `${req.user.firstName} ${req.user.lastName}`;

        if (!rating || !comment) {
            return res.status(400).json({ message: 'Puan ve yorum zorunludur.' });
        }

        const existing = await Review.findOne({ product: productId, user: userId });
        if (existing) {
            return res.status(400).json({ message: 'Bu ürüne zaten yorum yaptınız.' });
        }

        const review = await Review.create({
            product: productId,
            user: userId,
            userName,
            rating: Number(rating),
            comment,
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Yorum eklenemedi', error: error.message });
    }
};

// Yorum sil (kendi yorumu veya admin)
exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user._id || req.user.id;
        const review = await Review.findById(reviewId);
        
        if (!review) return res.status(404).json({ message: 'Yorum bulunamadı' });
        
        // Sadece kendi yorumunu silebilir veya ADMIN yetkisi varsa silebilir
        if (review.user.toString() !== userId.toString() && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Bu yorumu silme yetkiniz yok.' });
        }
        
        await Review.findByIdAndDelete(reviewId);
        res.json({ message: 'Yorum silindi.' });
    } catch (error) {
        res.status(500).json({ message: 'Yorum silinemedi', error: error.message });
    }
};

// Yorum Güncelle (sadece kendi yorumu)
exports.updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id || req.user.id;
        
        const review = await Review.findById(reviewId);
        
        if (!review) return res.status(404).json({ message: 'Yorum bulunamadı' });
        
        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Bu yorumu düzenleme yetkiniz yok.' });
        }
        
        if (rating) review.rating = Number(rating);
        if (comment) review.comment = comment;
        
        await review.save();
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Yorum güncellenemedi', error: error.message });
    }
};
