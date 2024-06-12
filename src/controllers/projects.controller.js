"use strict";
const { poolPromise, sql } = require("../config/sql.db");
const jwt = require("jsonwebtoken");
const TOKEN_KEY = process.env.JWT_TOKEN;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;

let { encryptData, decryptData } = require("../utils/encrypt");
const { MAX } = require("mssql");

const createProject = async (req, res, next) => {
  try {
    let { projectName, createdBy = 1 } = req.body;
    let { userRole, userId } = req.user;

    let pool = await poolPromise;
    let projectExist = await pool
      .request()
      .input("projectName", sql.NVarChar, projectName)
      .execute("usp_checkProjects");

    if (
      projectExist.recordset[0] &&
      projectExist.recordset[0].isProjectExists == true
    ) {
      return res.status(409).send({
        success: false,
        message: "project already exists!",
      });
    }

    let addproject = await pool
      .request()
      .input("name", sql.NVarChar(MAX), projectName)
      .input("createdBy", sql.Int, userId)
      .input("isActive", sql.Bit, true)
      .execute("usp_insertProject");

    let projectData = addproject.recordset;

    if (projectData && projectData[0] && projectData[0].ErrorNumber) {
      return res.status(500).send({
        success: false,
        message: "project not Added sucessfully",
      });
    }

    return res.status(201).send({
      success: true,
      data: projectData,
      message: "Project created sucessfully",
    });
  } catch (error) {
    console.log(error, "projects.controller -> createProject");
    next(error);
  }
};

const getProjectByUserId = async (req, res, next) => {
  try {
    let {  userId } = req.user;

    let pool = await poolPromise;
    let projectById = await pool
      .request()
      .input("userId", sql.Int, userId)
      .execute("usp_getProjectsByUserId");

    if (projectById && projectById.recordset && projectById.recordset.length == 0) {
      return res.status(400).send({
        success: false,
        message: "No Data Found ",
      });
    }

    let projectData = projectById.recordsets[0];

    return res.status(200).send({
      success: true,
      data: projectData,
    });
  } catch (error) {
    console.log(error, "project.controller -> getProjectByUserId");
    next(error);
  }
};

const getAllProject = async (req, res, next) => {
  try {
    // Get user input
    let { password } = req.body;

    let { userName: loginUser, id: loginUserId } = req.user;

    let pool = await poolPromise;
    let userExist = await pool
      .request()
      .input("userName", sql.NVarChar, loginUser)
      .execute("usp_checkRegisteredUser");

    if (userExist.recordset[0] && userExist.recordset[0].result == 0) {
      return res.send({
        success: false,
        message: "User detail not found !!",
      });
    }

    let encryptNewPassword = await encryptData(password);

    // Create user in our database
    let updateUser = await pool
      .request()
      .input("id", sql.Int, loginUserId)
      .input("password", sql.NVarChar, encryptNewPassword)
      .execute("usp_resetPassword");

    let userData = updateUser.recordset;

    if (userData && userData[0] && userData[0].ErrorNumber) {
      return res.send({
        success: false,
        message: "user Password not updated sucessfully",
      });
    }

    return res.send({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.log(error, "user.controller -> userResetPassword");
    next(error);
  }
};

module.exports = {
  createProject,
  getProjectByUserId,
  getAllProject,
};
