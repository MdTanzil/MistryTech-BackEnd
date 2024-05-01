const jwt = require("jsonwebtoken");
require("dotenv").config();
// jwt  create token  for authentication

const jwtTokenGenerate = (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.status(200).json({
    token: token,
  });
};

module.exports = jwtTokenGenerate;
