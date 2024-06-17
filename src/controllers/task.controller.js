"use strict";
const { poolPromise, sql } = require("../config/sql.db");
const { STATUS, STATUS_MAPPING } = require("../constants/status.const");

const createTask = async (req, res, next) => {
  try {
    let { title, deadLine, projectId, memberId, description = "" } = req.body;
    let { userRole, userId } = req.user;

    let pool = await poolPromise;
    let addTask = await pool
      .request()
      .input("title", sql.NVarChar, title)
      .input("description", sql.NVarChar, description)
      .input("deadline", sql.Date, deadLine)
      .input("projectId", sql.Int, projectId)
      .input("progress", sql.Int, 0)
      .input("priority", sql.NVarChar, "low")
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

// update or delete task --- 
const modifyTask = async (req, res, next) => {
  try {
    let { newTitle,taskId,newDesc,newDeadLine,newProgress,newPriority,isActive= true} = req.body;

    let { userRole, userId } = req.user;

    let pool = await poolPromise;
    let updateTask = await pool
      .request()
      .input("id", sql.Int, taskId)
      .input("title", sql.NVarChar, newTitle)
      .input("description", sql.NVarChar, newDesc)
      .input("priority", sql.NVarChar, newPriority)
      .input("deadline", sql.Date, newDeadLine)
      .input("progress", sql.Int, Number(newProgress))
      .input("updatedBy", sql.Int, userId)
      .input("isActive", sql.Bit, isActive)
      .execute("usp_updateTask");

    let taskData = updateTask.recordset[0];
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

  }catch (error) {
    console.log(error, "task.controller -> modifyTask");
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

// this api for which task assigned to login user
const getTaskByUserId = async (req, res, next) => {
  try {
    let { userId } = req.params;

    let { userId:memberId } = req.user;

    let pool = await poolPromise;
    let taskByUserId = await pool
      .request()
      .input("userId", sql.Int, memberId)
      .execute("usp_getTaskByUserId");

    if (
      taskByUserId &&
      taskByUserId.recordset &&
      taskByUserId.recordset.length == 0
    ) {
      return res.status(400).send({
        success: false,
        message: "No Data Found ",
      });
    }

    let taskData = taskByUserId.recordsets[0];

    return res.status(200).send({
      success: true,
      data: taskData,
    });

  } catch (error) {
    console.log(error, "task.controller -> getTaskByUserId");
    next(error);
  }
};




const editTaskStateById = async (req, res, next) => {
  try {
    let { idTask, newState } = req.body;

    let { userRole, userId } = req.user;
    // let progress = (Number(newState) / 4) * 100;
    let status = STATUS_MAPPING[Number(newState)];

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

const getCurrentTaskById = async (req, res, next) => {
  try {
    let { taskId } = req.params;
    let { userId } = req.user;

    let pool = await poolPromise;
    let taskById = await pool
      .request()
      .input("taskId", sql.Int, taskId)
      .execute("usp_getCurrentTaskById");

    if (
      taskById &&
      taskById.recordset &&
      taskById.recordset.length == 0
    ) {
      return res.status(400).send({
        success: false,
        message: "No Data Found ",
      });
    }

    let taskData = taskById.recordsets[0];

    const tasksMap = taskData.reduce((acc, row) => {
      if (!acc[row.id]) {
          acc[row.id] = {
              id: row.id,
              progress: row.progress,
              deadline: row.deadline,
              startDate: row.startDate,
              description: row.description,
              status: row.status,
              title: row.title,
              projectId: row.projectId,
              memberId: row.memberId,
              isActive: row.isActive,
              createdDate: row.createdDate,
              updatedDate: row.updatedDate,
              createdBy: row.createdBy,
              updatedBy: row.updatedBy,
              responsible: row.responsible,
              comments: []
          };
      }
      if (row.content) {
          acc[row.id].comments.push({
            commentId : row.commentId,
              content: row.content,
              author: row.author,
              taskId: row.taskId,
              authorName: row.authorName,
          });
      }
      return acc;
  }, {});

  const tasks = Object.values(tasksMap);


    return res.status(200).send({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.log(error, "task.controller -> getCurrentTaskById");
    next(error);
  }
};

// comemnt api 
const addComment = async (req, res, next) => {
  try {
    let { text, authorId, taskId } = req.body;
    let { userRole, userId } = req.user;

    let pool = await poolPromise;
    let addComment = await pool
      .request()
      .input("content", sql.NVarChar, text)
      .input("taskId", sql.Int, taskId)
      .input("createdBy", sql.Int, userId)
      .input("isActive", sql.Bit, true)
      .execute("usp_insertComments");

    let commentData = addComment.recordset[0];

    if (commentData && commentData[0] && commentData[0].ErrorNumber) {
      return res.status(500).send({
        success: false,
        message: "comment not Added sucessfully",
      });
    }

    return res.status(201).send({
      success: true,
      data: commentData,
      message: "comment created sucessfully",
    });

  } catch (error) {
    console.log(error, "task.controller -> addComment");
    next(error);
  }
};

const updateOrDeleteComment = async (req, res, next) => {
  try {
    let { text:content, commentId, isActive } = req.body;
    let { userRole, userId } = req.user;


    let pool = await poolPromise;
    let updateComment = await pool
      .request()
      .input("commentId", sql.Int, commentId)
      .input("content", sql.NVarChar, content)
      .input("isActive", sql.Bit, isActive)
      .execute("usp_updateComments");

    let commentData = updateComment.recordset[0];

    if (commentData && commentData[0] && commentData[0].ErrorNumber) {
      return res.status(500).send({
        success: false,
        message: "comment not Upadted sucessfully",
      });
    }

    return res.status(200).send({
      success: true,
      data: commentData,
      message: "comment updated sucessfully",
    });

  } catch (error) {
    console.log(error, "task.controller -> updateOrDeleteComment");
    next(error);
  }
};

module.exports = {
  createTask,
  modifyTask,
  getTaskByProjectId,
  getTaskByUserId,
  editTaskStateById,
  getCurrentTaskById,
  addComment,
  updateOrDeleteComment
};
