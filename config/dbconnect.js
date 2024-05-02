const dbConnect = () => {
  const mongoose = require("mongoose");

  mongoose.connect("mongodb://127.0.0.1:27017").then(
    () => {
      console.log("connect db successful");
    },
    (err) => {
      /** handle initial connection error */
      console.log("connect db  error");
    }
  );
};

module.exports = dbConnect();
