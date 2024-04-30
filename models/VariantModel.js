const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Variant Schema
const variantSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  skuCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    min: 0,
    default: 0,
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  color: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update 'updatedAt' field before each save
variantSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Variant = mongoose.model("Variant", variantSchema);

module.exports = Variant;
