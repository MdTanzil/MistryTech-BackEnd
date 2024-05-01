require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const adminVerify = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    const { email } = decoded;
    try {
      const user = await User.findOne({ email });
      if (!user || user.role !== "admin") {
        return res.status(403).send({
          message: "You are not authorized to access this resource",
        });
      }
      // If user is admin, add user information to the request object
      req.user = user;
      next();
    } catch (error) {}
  });
};

module.exports = adminVerify;
