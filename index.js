const { dbConnect, corsSetting } = require("./config");

const express = require("express");
const cors = require("cors");
const {
  userRouter,
  categoryRouter,
  productRouter,
  variantRouter,
  orderItemRouter,
  orderRouter,
  jwtRouter,
  subCategoryRouter,
} = require("./router");

const app = express();
const port = 3000;

//--------------------------------------------------
//              Middlewares
//--------------------------------------------------

//Json parser
app.use(express.json());
// Enable CORS for all routes
app.use(cors(corsSetting));
// Serve static files from the 'uploads' directory
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API Active");
});

//--------------------------------------------------
//              Routes
//--------------------------------------------------

app.use("/user", userRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/variants", variantRouter);
app.use("/order-item", orderItemRouter);
app.use("/order", orderRouter);
app.use("/jwt", jwtRouter);
app.use("/sub-categories", subCategoryRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
