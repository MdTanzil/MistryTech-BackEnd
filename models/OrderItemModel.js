const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Variant Schema
const orderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  productVariant: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Variant",
  },
  quantity: {
    type: Number,
    min: 0,
  },
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
orderItemSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

module.exports = OrderItem;
