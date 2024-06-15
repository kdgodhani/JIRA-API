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
    updateOrDeleteProject,
    getProjectByUserId,
    addProjectMember,
    getMemberByProjectId,
    updateOrDeleteMember
} = require("../controllers/projects.controller");

// This is child route of project like projects/tasks/...
let task = require("./task.route")
router.use("/tasks",task)


router.post(
  "/create",
  verifyToken,
  validateBody(createProjectSchema),
  createProject
);

router.post(
  "/updateOrDelete",
  verifyToken,
  // validateBody(createProjectSchema),
  updateOrDeleteProject
);

router.get("/getAllByUserId", verifyToken,  getProjectByUserId);


// Project Member api
router.post("/addMember", verifyToken,  addProjectMember);

router.post("/memberUpdateOrDelete", verifyToken,  updateOrDeleteMember);


router.get("/membersByProjectId", verifyToken,  getMemberByProjectId);

module.exports = router;
