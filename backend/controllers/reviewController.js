const Review = require('../models/Review');
const Product = require('../models/Product');

const recalcRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const avg = stats[0]?.avg || 0;
  const count = stats[0]?.count || 0;
  await Product.findByIdAndUpdate(productId, {
    ratingAverage: Math.round(avg * 10) / 10,
    ratingCount: count,
  });
};

exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
    } else {
      await Review.create({ product: productId, user: req.user._id, rating, comment });
    }
    await recalcRating(productId);
    const reviews = await Review.find({ product: productId }).populate('user', 'name');
    res.status(201).json(reviews);
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    await recalcRating(review.product);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};
