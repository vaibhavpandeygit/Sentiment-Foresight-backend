const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  discountAmount: { type: Number },
  discountPercentage: { type: Number },
  pointsRequired: { type: Number, required: true },
  maxRedemptions: { type: Number, default: 1 },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coupon', couponSchema);