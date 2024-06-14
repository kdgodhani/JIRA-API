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
    getProjectByUserId,
    addProjectMember,
    getMemberByProjectId
} = require("../controllers/projects.controller");


router.post(
  "/create",
  verifyToken,
  validateBody(createProjectSchema),
  createProject
);

let task = require("./task.route")
router.use("/tasks",task)
// router.post("/update", verifyToken, validateBody(createProjectSchema), getProjectByUserId);

router.post("/addMember", verifyToken,  addProjectMember);

router.get("/getAllByUserId", verifyToken,  getProjectByUserId);

router.get("/membersByProjectId", verifyToken,  getMemberByProjectId);

module.exports = router;
