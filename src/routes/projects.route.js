"use strict";
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");

const {
  createProjectSchema,
  updateDeleteProjectSchema,
  addProjectMemberSchema,
  updateDeleteProjectMemberSchema,
  getMemberByProjectIdSchema
} = require("../validations/projects.validator");

const { validateBody, validateQuery } = require("../validations/joi.validator");

const {
  createProject,
  updateOrDeleteProject,
  getProjectByUserId,
  addProjectMember,
  getMemberByProjectId,
  updateOrDeleteMember,
} = require("../controllers/projects.controller");

// This is child route of project like projects/tasks/...
let task = require("./task.route");
router.use("/tasks", task);

router.post(
  "/create",
  verifyToken,
  validateBody(createProjectSchema),
  createProject
);

router.post(
  "/updateOrDelete",
  verifyToken,
  validateBody(updateDeleteProjectSchema),
  updateOrDeleteProject
);

router.get("/getAllByUserId", verifyToken, getProjectByUserId);

// Project Member api
router.post(
  "/addMember",
  verifyToken,
  validateBody(addProjectMemberSchema),
  addProjectMember
);

router.post("/memberUpdateOrDelete", verifyToken,validateBody(updateDeleteProjectMemberSchema), updateOrDeleteMember);

router.get("/membersByProjectId",
   verifyToken,
   validateQuery(getMemberByProjectIdSchema),
    getMemberByProjectId);

module.exports = router;
