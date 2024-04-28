const { dbConnect, corsSetting } = require("./config");

const express = require("express");
const cors = require("cors");
const { userRouter, categoryRouter } = require("./router");

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
