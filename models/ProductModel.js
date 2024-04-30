const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
  },
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  price: {
    type: Number,
    required: true,
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
  active: {
    type: Boolean,
    default: true,
  },
  variants: [
    {
      type: Schema.Types.ObjectId,
      ref: "Variant",
    },
  ],
});
// Middleware to update 'updatedAt' and slug field before each save
productSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  if (!this.isModified("name")) {
    return next();
  }
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
