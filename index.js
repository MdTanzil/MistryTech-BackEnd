const { dbConnect } = require("./config");

const express = require("express");
const { userRouter, categoryRouter } = require("./router");


const app = express();
const port = 3000;

//middlewares

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/user", userRouter);
app.use("/categories", categoryRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
