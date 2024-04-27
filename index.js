const { dbConnect } = require("./config");

const express = require("express");
const userRouter = require("./router/userRouter");
const app = express();
const port = 3000;

//middlewares

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
