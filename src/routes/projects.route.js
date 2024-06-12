"use strict";
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");

const {
    createProjectSchema,
} = require("../validations/projects.validator");

const {
  validateBody,
  validateQuery,
} = require("../validations/joi.validator");

const {
    createProject,
    getProjectByUserId
} = require("../controllers/projects.controller");


router.post(
  "/create",
  verifyToken,
  validateBody(createProjectSchema),
  createProject
);

router.post("/update", verifyToken, validateBody(createProjectSchema), getProjectByUserId);

router.get("/getAllByUserId", verifyToken,  getProjectByUserId);

module.exports = router;
