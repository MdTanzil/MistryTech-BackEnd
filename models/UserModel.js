const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"], // Only 'admin' or 'user' values are allowed
    default: "user", // Optional: set a default value
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
userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
