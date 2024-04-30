const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Variant Schema
const orderSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    min: 0,
    default: 0,
  },
  netAmount: {
    type: Number,
    min: 0,
    default: 0,
  },
  discountAmount: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  shippingAmount: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  color: {
    type: String,
  },
  orderItem: [
    {
      type: Schema.Types.ObjectId,
      ref: "OrderItem",
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
orderSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
