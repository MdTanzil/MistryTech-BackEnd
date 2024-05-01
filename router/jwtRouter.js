const jwt = require("jsonwebtoken");
require("dotenv").config();
// jwt  create token  for authentication

const express = require("express");
const { jwtTokenGenerate } = require("../handler");

const jwtRouter = express.Router();

jwtRouter.post("/", jwtTokenGenerate);

module.exports = jwtRouter;
