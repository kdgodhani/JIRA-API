"use strict";
const Joi = require("joi");

const createTaskSchema = Joi.object().keys({
  title: Joi.string().required(),
  deadLine: Joi.date().required(),
  projectId: Joi.number().required(),
  memberId: Joi.number().required(),
  isActive: Joi.boolean().optional(),
});

const modifyTaskSchema = Joi.object().keys({
  // newTitle,taskId,newDesc,newDeadLine,newProgress,newPriority,isActive= true
  newTitle: Joi.string().optional(),
  newPriority: Joi.string().optional(),
  newDesc: Joi.string().optional(),
  newDeadLine: Joi.date().optional(),
  taskId: Joi.number().required(),
  newProgress: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

const editTaskStateSchema = Joi.object().keys({
  idTask: Joi.number().required(),
  newState: Joi.number().required(),
  isActive: Joi.boolean().optional(),
});

const addCommentSchema = Joi.object().keys({
  // text, authorId, taskId
  text: Joi.string().required(),
  authorId: Joi.number().required(),
  taskId: Joi.number().required(),
  isActive: Joi.boolean().optional(),
});

const updateDeleteCommentSchema = Joi.object().keys({
  // text:content, commentId, isActive
  text: Joi.string().optional(),
  commentId: Joi.number().required(),
  isActive: Joi.boolean().optional(),
});

module.exports = {
  createTaskSchema,
  modifyTaskSchema,
  editTaskStateSchema,
  addCommentSchema,
  updateDeleteCommentSchema,
};
