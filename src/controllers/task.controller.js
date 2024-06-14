"use strict";
const { poolPromise, sql } = require("../config/sql.db");
const { STATUS, STATUS_MAPPING } = require("../constants/status.const");

const createTask = async (req, res, next) => {
  try {
    let { title, deadLine, projectId, memberId, description = "" } = req.body;

    console.log(req.body, "this is request --- -");
    let { userRole, userId } = req.user;

    let pool = await poolPromise;
    let addTask = await pool
      .request()
      .input("title", sql.NVarChar, title)
      .input("description", sql.NVarChar, description)
      .input("deadline", sql.Date, deadLine)
      .input("projectId", sql.Int, projectId)
      .input("progress", sql.Int, 0)
      .input("status", sql.NVarChar, STATUS.PENDING)
      .input("memberId", sql.Int, memberId)
      .input("createdBy", sql.Int, userId)
      .input("isActive", sql.Bit, true)
      .execute("usp_insertTask");

    let taskData = addTask.recordset[0];

    if (taskData && taskData[0] && taskData[0].ErrorNumber) {
      return res.status(500).send({
        success: false,
        message: "project not Added sucessfully",
      });
    }

    return res.status(201).send({
      success: true,
      data: taskData,
      message: "Task created sucessfully",
    });
  } catch (error) {
    console.log(error, "task.controller -> createTask");
    next(error);
  }
};

const getTaskByProjectId = async (req, res, next) => {
  try {
    let { projectId } = req.params;
    let { userId } = req.user;

    let pool = await poolPromise;
    let taskByProjectId = await pool
      .request()
      .input("projectId", sql.Int, projectId)
      .execute("usp_getTaskByProjectId");

    if (
      taskByProjectId &&
      taskByProjectId.recordset &&
      taskByProjectId.recordset.length == 0
    ) {
      return res.status(400).send({
        success: false,
        message: "No Data Found ",
      });
    }

    let taskData = taskByProjectId.recordsets[0];

    return res.status(200).send({
      success: true,
      data: taskData,
    });
  } catch (error) {
    console.log(error, "task.controller -> getTaskByProjectId");
    next(error);
  }
};

const editTaskStateById = async (req, res, next) => {
  try {
    let { idTask, newState } = req.body;

    let { userRole, userId } = req.user;
    // let progress = (Number(newState) / 4) * 100;
    let status = STATUS_MAPPING[Number(newState)];


    console.log(status,"euiueiruiureu")

    let pool = await poolPromise;
    let updateTask = await pool
      .request()
      .input("id", sql.Int, idTask)
      // .input("title", sql.NVarChar, title)
      // .input("description", sql.NVarChar, description)
      // .input("deadline", sql.Date, deadLine)
      // .input("projectId", sql.Int, projectId)
      // .input("progress", sql.Int, 0)
      .input("status", sql.NVarChar, status)
      // .input("memberId", sql.Int, memberId)
      .input("updatedBy", sql.Int, userId)
      // .input("isActive", sql.Bit, true)
      .execute("usp_updateTask");

    let taskData = updateTask.recordset;
    if (taskData && taskData[0] && taskData[0].ErrorNumber) {
      return res.status(500).send({
        success: false,
        message: "Task not Updated sucessfully",
      });
    }

    return res.status(200).send({
      success: true,
      data: taskData,
      message: "Task Updated sucessfully",
    });

  } catch (error) {
    console.log(error, "task.controller -> editTaskStateById");
    next(error);
  }
};

module.exports = {
  createTask,
  getTaskByProjectId,
  editTaskStateById,
};
