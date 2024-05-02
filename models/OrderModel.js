const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Variant Schema
const orderSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
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
    min: 0,
    default: 0,
  },
  shippingAmount: {
    type: Number,
    min: 0,
    default: 0,
  },
  orderItem: [
    {
      type: Schema.Types.ObjectId,
      ref: "OrderItem",
    },
  ],
  fullAddress: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
      "on_hold",
      "payment_failed",
      "delayed",
      "completed",
    ],
    default: "pending",
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
