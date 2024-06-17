"use strict";
const Joi = require("joi");

const createProjectSchema = Joi.object().keys({
    projectName: Joi.string().required(),
});

const updateDeleteProjectSchema = Joi.object().keys({
  name: Joi.string().optional(),
  id: Joi.number().required(),
  isActive: Joi.boolean().optional(),
});

const addProjectMemberSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  id: Joi.number().required(),
});

const updateDeleteProjectMemberSchema = Joi.object().keys({
  isActive: Joi.boolean().optional(),
  projectId: Joi.number().required(),
  memberId: Joi.number().required(),
});

const getMemberByProjectIdSchema = Joi.object().keys({
  id: Joi.number().required(),
});


module.exports = {
    createProjectSchema,
    updateDeleteProjectSchema,
    addProjectMemberSchema,
    updateDeleteProjectMemberSchema,
    getMemberByProjectIdSchema
};
