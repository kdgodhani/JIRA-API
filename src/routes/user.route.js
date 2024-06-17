"use strict";
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const multer = require('multer');
const path = require('path');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Specify the folder to store the uploaded files
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// // Create the multer instance with storage configuration
// const upload = multer({ storage: storage });



const {
  createUserSchema,
  userLoginSchema,
  userLogoutSchema,
  imageAddUpdateSchema
} = require("../validations/user.validation");

const {
  validateBody,
  validateParams,
} = require("../validations/joi.validator");

const {
  userRegister,
  userLogin,
  updateOrDelete,
  userGetAll,
  addUpdateImage,
  getUserImage
} = require("../controllers/user.controller");


router.post(
  "/register",
  // verifyToken,
  validateBody(createUserSchema),
  userRegister
);

router.post("/login", validateBody(createUserSchema), userLogin);

router.post("/addUpdateImage",
  // upload.single('image'),
   addUpdateImage
  );

router.get("/getImage",
  // upload.single('image'),
  getUserImage
  );

router.put("/updateOrDelete", 
  verifyToken,
  // validateBody(createUserSchema), 
  updateOrDelete);

router.get("/getAll", 
  verifyToken,
  userGetAll);

module.exports = router;
