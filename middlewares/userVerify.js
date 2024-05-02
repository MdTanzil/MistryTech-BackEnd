require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const userVerify = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    const { email } = decoded;
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(403).send({
          message: "You are not authorized to access this resource",
        });
      }

      if (user.role === "admin" || user.email === email) {
        // If user is admin or token email matches user's email, add user information to the request object
        req.user = user;
        next();
      } else {
        return res.status(403).send({
          message: "You are not authorized to access this resource",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  });
};

module.exports = userVerify;
