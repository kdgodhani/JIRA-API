"use strict";
const Joi = require("joi");
const pattern = /^.{8,20}$/;

const createUserSchema = Joi.object().keys({
  id: Joi.number().optional(),
  email: Joi.string().required(),
  password: Joi.string().regex(RegExp(pattern)).min(8).max(20).required(),
  isActive: Joi.boolean()
    // .when("id", { is: 0, then: Joi.boolean().required() })
    .optional(),
  name: Joi.string().optional(),
});

const userLoginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const userLogoutSchema = Joi.object().keys({
  id: Joi.number().required(),
});

const updateDeleteUserSchema = Joi.object().keys({
  role: Joi.string().optional(),
  id: Joi.number().required(),
  isActive: Joi.boolean().optional(),
});

const imageAddUpdateSchema = Joi.object().keys({
  image: Joi.string().optional(),
  userId:Joi.number().required(),
});

const getImageSchema = Joi.object().keys({
  userId:Joi.number().required(),
});

module.exports = {
  createUserSchema,
  userLoginSchema,
  userLogoutSchema,
  imageAddUpdateSchema,
  updateDeleteUserSchema,
  getImageSchema
};
