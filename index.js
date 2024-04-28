const { dbConnect } = require("./config");

const express = require("express");
const cors = require("cors");
const { userRouter, categoryRouter } = require("./router");

const app = express();
const port = 3000;

//middlewares

app.use(express.json());
// Enable CORS for all routes
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/user", userRouter);
app.use("/categories", categoryRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
