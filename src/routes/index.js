"use strict";
const express = require("express");
const router = express.Router();

const user = require("../routes/user.route");
const projects = require("../routes/projects.route");

router.use("/user", user);

router.use("/projects", projects);

module.exports = router;
