"use strict";
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");

const {
    createTaskSchema,
} = require("../validations/task.validator");

const {
  validateBody,
  validateQuery,
} = require("../validations/joi.validator");

const {
    createTask,
    getTaskByProjectId,
    editTaskStateById
} = require("../controllers/task.controller");


router.post(
  "/create",
  verifyToken,
//   validateBody(createTaskSchema),
  createTask
);

router.post(
  "/editState",
  verifyToken,
//   validateBody(createTaskSchema),
editTaskStateById
);

router.get("/:projectId", verifyToken,  getTaskByProjectId);


module.exports = router;
