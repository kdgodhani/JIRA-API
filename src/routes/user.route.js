"use strict";
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");

const {
  createUserSchema,
  userLoginSchema,
  userLogoutSchema,
} = require("../validations/user.validation");

const {
  validateBody,
  validateParams,
} = require("../validations/joi.validator");

const {
  userRegister,
  userLogin,
} = require("../controllers/user.controller");


router.post(
  "/register",
  // verifyToken,
  validateBody(createUserSchema),
  userRegister
);

router.post("/login", validateBody(createUserSchema), userLogin);

module.exports = router;
