const mongoose = require("mongoose");
const { Schema } = mongoose;

/* ---------- Subdocument: Brand Profile ---------- */
const brandDetailsSchema = new Schema({
  companyName: { type: String, required: true },
  website: { type: String },
  logo: { type: String },
  contactPerson: { type: String },
  phone: { type: String },
  address: { type: String },
  gstin: { type: String },
  erpIntegration: {
    enabled: { type: Boolean, default: false },
    apiEndpoint: { type: String },
    apiKey: { type: String },
  },
}, { _id: false });

/* ---------- Subdocument: Consumer Profile ---------- */
const consumerDetailsSchema = new Schema({
  points: { type: Number, default: 0 },
  redeemedCoupons: [{ type: Schema.Types.ObjectId, ref: "Coupon" }],
  location: { type: String }, // for regional sentiment filters
  birthDate: { type: Date },  // for optional personalization
  gender: { type: String, enum: ["male", "female", "other"], default: "other" }
}, { _id: false });

/* ---------- Main User Schema ---------- */
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { type: String, required: true }, // Hashed
  role: { 
    type: String, 
    enum: ["admin", "brand", "consumer"], 
    required: true 
  },
  brandDetails: {
    type: brandDetailsSchema,
    required: function () { return this.role === "brand"; }
  },
  consumerDetails: {
    type: consumerDetailsSchema,
    required: function () { return this.role === "consumer"; }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
