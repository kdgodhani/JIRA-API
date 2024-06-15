"use strict";
const { poolPromise, sql } = require("../config/sql.db");
const jwt = require("jsonwebtoken");
const TOKEN_KEY = process.env.JWT_TOKEN;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;

let { encryptData, decryptData } = require("../utils/encrypt");

let ROLE = {
  USER: "User",
  MANAGER: "Manager",
};

// Mannually entry in sql server

// name : "admin"
// email : "admin@planetx.com"
// password : "ee1f0a3f4c4da800a13807d5520a6cf7"  // Test@123
// role:"Admin"

// In that Verify admin we can also add as middleware but in this project not used that way

const userRegister = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;

    let pool = await poolPromise;
    let userExist = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .execute("usp_checkRegisteredUser");

    if (userExist.recordset[0] && userExist.recordset[0].UserExists == true) {
      return res.status(409).send({
        success: false,
        message: "User already exists!",
      });
    }

    let encryptPassword = await encryptData(password);

    let addUser = await pool
      .request()
      .input("name", sql.NVarChar, name)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, encryptPassword)
      .input("isActive", sql.Bit, true)
      .input("role", sql.NVarChar, ROLE.USER)
      .execute("usp_insertUpdateUser");

    let User = addUser.recordset;

    if (User && User[0] && User[0].ErrorNumber) {
      return res.status(500).send({
        success: false,
        message: "user not created sucessfully",
      });
    }

    return res.status(201).send({
      success: true,
      data: User,
      message: "user created sucessfully",
    });
  } catch (error) {
    console.log(error, "user.controller -> userRegister");
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    // Get user input
    let { email, password } = req.body;

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

    let user = userExist.recordset[0];

    // console.log(user,"userExist---- ")

    let decryptPassword = await decryptData(user.password);

    if (!(decryptPassword == password)) {
      return res.status(400).send({
        success: false,
        message: "password is not match !!",
      });
    }

    let finalData = [];
    let userId = user.id;
    let userEmail = user.email;
    let userRole = user.role;
    let userName = user.name;

    let token = jwt.sign({ userId, userEmail, userRole }, TOKEN_KEY, {
      expiresIn: TOKEN_EXPIRY,
    });

    finalData.push({
      id: userId,
      email: userEmail,
      name: userName,
      token: token,
    });

    return res.status(200).send({
      success: true,
      data: finalData,
    });
  } catch (error) {
    console.log(error, "user.controller -> userLogin");
    next(error);
  }
};

const userUpdate = async (req, res, next) => {
  try {
    let { role,  id, isActive } = req.body;

    let { userRole } = req.user;

    if (!userRole || (userRole && userRole !== "Admin")) {
      return res.send({
        success: false,
        message: "Only Admin Can Update User Role!!",
        data: [],
      });
    }

    let pool = await poolPromise;
    let userExist = await pool
      .request()
      .input("id", sql.Int, id)
      .execute("usp_checkAndGetUserById");

    if (userExist && userExist.recordset && userExist.recordset.length == 0) {
      return res.status(400).send({
        success: false,
        message: "User is Not Exits !!",
      });
    }

    let findedUser = userExist.recordset[0];

    let upadteUser = await pool
      .request()
      .input("isActive", sql.Bit, isActive)
      .input("role", sql.NVarChar, role)
      .input("id", sql.Int, findedUser.id)
      .execute("usp_insertUpdateUser");

    let User = upadteUser.recordset;

    if (User && User[0] && User[0].ErrorNumber) {
      return res.status(500).send({
        success: false,
        message: "user not created sucessfully",
      });
    }

    return res.status(200).send({
      success: true,
      data: User,
      message: "user Updated sucessfully",
    });
  } catch (error) {
    console.log(error, "user.controller -> userRegister");
    next(error);
  }
};

const userGetAll = async (req, res, next) => {
  try {
    let { userRole } = req.user;

    if (!userRole || (userRole && userRole !== "Admin")) {
      return res.send({
        success: false,
        message: "Only Admin Can get All User data!!",
        data: [],
      });
    }

    let pool = await poolPromise;
    let getAllUser = await pool.request().execute("usp_getAllUser");

    let userData = getAllUser.recordsets[0];

    if (userData && userData[0] && userData[0].ErrorNumber) {
      return res.status(500).send({
        success: false,
        message: "Getting user issue ",
      });
    }

    return res.status(200).send({
      success: true,
      data: userData,
      message: "all user data ",
    });
  } catch (error) {
    console.log(error, "user.controller -> getAllUser");
    next(error);
  }
};

const userResetPassword = async (req, res, next) => {
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
  userRegister,
  userLogin,
  userResetPassword,
  userUpdate,
  userGetAll,
};
