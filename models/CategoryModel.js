const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const categorySchema = new Schema({
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
  imagePath: {
    type: String,
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
});

// Middleware to update 'updatedAt' field before each save
categorySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  if (!this.isModified("name")) {
    return next();
  }
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
