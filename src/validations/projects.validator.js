"use strict";
const Joi = require("joi");

const createProjectSchema = Joi.object().keys({
    projectName: Joi.string().required(),
});

const userLoginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
    createProjectSchema,
  userLoginSchema,
};
