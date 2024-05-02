const categoryRouter = require("./categoryRouter");
const jwtRouter = require("./jwtRouter");
const orderItemRouter = require("./orderItemRouter");
const orderRouter = require("./orderRouter");
const productRouter = require("./productRouter");
const subCategoryRouter = require("./subCategoryRouter");
const userRouter = require("./userRouter");
const variantRouter = require("./variantRouter");

module.exports = {
  userRouter,
  categoryRouter,
  productRouter,
  variantRouter,
  orderItemRouter,
  orderRouter,
  jwtRouter,
  subCategoryRouter,
};
