const categoryRouter = require("./categoryRouter");
const orderItemRouter = require("./orderItemRouter");
const orderRouter = require("./orderRouter");
const productRouter = require("./productRouter");
const userRouter = require("./userRouter");
const variantRouter = require("./variantRouter");

module.exports = {
  userRouter,
  categoryRouter,
  productRouter,
  variantRouter,
  orderItemRouter,
  orderRouter,
};
