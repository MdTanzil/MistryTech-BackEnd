const dbConnect = () => {
  const mongoose = require("mongoose");

  mongoose.connect("mongodb://localhost:27017").then(
    () => {
      console.log("connect db successful");
    },
    (err) => {
      /** handle initial connection error */
    }
  );
};

module.exports = dbConnect();
