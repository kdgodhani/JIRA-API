"use strict";
const { poolPromise, sql } = require("../config/sql.db");
const jwt = require("jsonwebtoken");
const TOKEN_KEY = process.env.JWT_TOKEN;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;

let { encryptData, decryptData } = require("../utils/encrypt");

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
      .input("name", sql.NVarChar, projectName)
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


    const transformedData = projectData.reduce((acc, curr) => {
        let project = acc.find(p => p.id === curr.id);
        if (!project) {
            project = {
                id: curr.id,
                name: curr.name,
                createdDateTime: curr.createdDateTime,
                createdBy: curr.createdBy,
                updatedBy: curr.updatedBy,
                isActive: curr.isActive,
                members: []
            };
            acc.push(project);
        }
        if (curr.projectId) {
            project.members.push({
                projectId: curr.projectId,
                memberId: curr.memberId,
                memberName: curr.memberName
            });
        }

        return acc;
    }, []);

    return res.status(200).send({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.log(error, "project.controller -> getProjectByUserId");
    next(error);
  }
};

const addProjectMember = async (req, res, next) => {
  try {
    // Get user input
    let { email,id:projectId } = req.body;
    let { userName, userId } = req.user;

    let pool = await poolPromise;
    let userExist = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .execute("usp_checkAndGetUser");

    if (userExist && userExist.recordset && userExist.recordset.length == 0) {
      return res.status(400).send({
        success: false,
        message: "User is Not Exits !!",
      });
    }

    let memberUser = userExist.recordset[0]
    let memberExist = await pool
    .request()
    .input("projectId", sql.Int, projectId)
    .input("memberId", sql.Int, memberUser.id)
    .execute("usp_checkMember");

  if (
    memberExist.recordset[0] &&
    memberExist.recordset[0].isMemberExists == true
  ) {
    return res.status(409).send({
      success: false,
      message: "Member already exists In Project !",
    });
  }


    let addMember = await pool
      .request()
      .input('projectId', sql.Int, projectId)
      .input('memberId', sql.Int, memberUser.id)
      .input('memberMail', sql.NVarChar(255), memberUser.email)
      .input('createdBy', sql.Int, userId)
      .input('isActive', sql.Bit, true)
      .execute('usp_insertProjectMember')

    let memberData = addMember.recordset;
    if (memberData && memberData[0] && memberData[0].ErrorNumber) {
      return res.status(500).send({
        success: false,
        message: "Member Not Added sucessfully",
      });
    }

    return res.status(201).send({
      success: true,
      message: "Member Added sucessfully",
      data: memberData,
    });

  } catch (error) {
    console.log(error, "projects.controller -> addProjectMember");
    next(error);
  }
};

const getMemberByProjectId = async (req, res, next) => {
    try {
      let {  id:projectId } = req.query;
  
      let pool = await poolPromise;
      let memberById = await pool
        .request()
        .input("projectId", sql.Int, projectId)
        .execute("usp_getMemberByProjectId");
  
      if (memberById && memberById.recordset && memberById.recordset.length == 0) {
        return res.status(400).send({
          success: false,
          message: "No Project Member Data Found ",
        });
      }
  
      let memberData = memberById.recordsets[0];
  
      return res.status(200).send({
        success: true,
        data: memberData,
      });
    } catch (error) {
      console.log(error, "project.controller -> getMemberByProjectId");
      next(error);
    }
  };

module.exports = {
  createProject,
  getProjectByUserId,
  addProjectMember,
  getMemberByProjectId
};
