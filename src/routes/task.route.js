"use strict";
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");

const {
    createTaskSchema,
    modifyTaskSchema,
    editTaskStateSchema,
    addCommentSchema,
    updateDeleteCommentSchema
} = require("../validations/task.validator");

const {
  validateBody,
  validateQuery,
} = require("../validations/joi.validator");

const {
    createTask,
    modifyTask,
    getTaskByProjectId,
    getTaskByUserId,
    editTaskStateById,
    getCurrentTaskById,
    addComment,
    updateOrDeleteComment,
} = require("../controllers/task.controller");


router.post(
  "/create",
  verifyToken,
  validateBody(createTaskSchema),
  createTask
);

router.post(
  "/modify",
  verifyToken,
  validateBody(modifyTaskSchema),
  modifyTask
);

router.post(
  "/editState",
  verifyToken,
  validateBody(editTaskStateSchema),
editTaskStateById
);

router.get("/:projectId", verifyToken,  getTaskByProjectId);

router.get("/getAllTaskByUserId/:userId", verifyToken,  getTaskByUserId);

router.get("/getTaskById/:taskId", verifyToken,  getCurrentTaskById);


// below is add comment 

router.post(
  "/addComment",
  verifyToken,
  validateBody(addCommentSchema),
  addComment
);

router.post(
  "/updateOrDeleteComment",
  verifyToken,
  validateBody(updateDeleteCommentSchema),
updateOrDeleteComment
);


module.exports = router;
