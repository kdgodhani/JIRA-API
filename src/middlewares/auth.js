"use strict";
const jwt = require("jsonwebtoken");
let TOKEN_KEY = process.env.JWT_TOKEN;

/*
Verify Token of JWT
*/
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  let err = {};
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, TOKEN_KEY, async (error, user) => {
      if (error && error.message) {
        console.log();
        err.message = error.message;
        err.success = false;
        return res.status(401).json(err);
      }

      req.user = user;
      next();
    });
  } else {
    err.message = "Token is missing !!";
    err.success = false;
    return res.status(400).json(err);
  }
};

module.exports = {
  verifyToken,
};
