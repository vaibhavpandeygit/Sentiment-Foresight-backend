const asyncHandler = require('express-async-handler');
const Product = require('../../models/Product');
const Review = require('../../models/Review');
const { getSentimentScore } = require('../../utility/getSentimentScore');
const verifyBuy = require('../../utility/verifyBuy');


exports.writeReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, text, rating, location } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Prevent multiple reviews by same user on same product
  const existingReview = await Review.findOne({ productId, userId });
  if (existingReview) {
    return res.status(400).json({ message: 'You have already reviewed this product.' });
  }

  // Prepare review data
  const sentimentScore = getSentimentScore({ text, rating });
  const verified = verifyBuy(userId, productId);
  const region = location?.city || 'Unknown';

  const review = new Review({
    productId,
    userId,
    text,
    rating,
    sentimentScore,
    verified,
    region
  });

  await review.save();
  user.consumerDetails.points = user.consumerDetails.points + 10; // Add points for writing a review
  await user.save();

  res.status(201).json({ message: 'Review submitted successfully', review });
});