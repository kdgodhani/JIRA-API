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
    modifyTask,
    getTaskByProjectId,
    editTaskStateById,
    getCurrentTaskById
} = require("../controllers/task.controller");


router.post(
  "/create",
  verifyToken,
//   validateBody(createTaskSchema),
  createTask
);

router.post(
  "/modify",
  verifyToken,
//   validateBody(createTaskSchema),
  modifyTask
);

router.post(
  "/editState",
  verifyToken,
//   validateBody(createTaskSchema),
editTaskStateById
);

router.get("/:projectId", verifyToken,  getTaskByProjectId);

router.get("/getTaskById/:taskId", verifyToken,  getCurrentTaskById);


module.exports = router;
