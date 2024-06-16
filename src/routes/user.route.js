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
  updateOrDelete,
  userGetAll,
  updateImage
} = require("../controllers/user.controller");


router.post(
  "/register",
  // verifyToken,
  validateBody(createUserSchema),
  userRegister
);

router.post("/login", validateBody(createUserSchema), userLogin);

router.post("/updateImage", validateBody(createUserSchema), updateImage);

router.put("/updateOrDelete", 
  verifyToken,
  // validateBody(createUserSchema), 
  updateOrDelete);

router.get("/getAll", 
  verifyToken,
  userGetAll);

module.exports = router;
