"use strict";
const Joi = require("joi");

const createTaskSchema = Joi.object().keys({
    projectName: Joi.string().required(),
});


module.exports = {
    createTaskSchema,
};
