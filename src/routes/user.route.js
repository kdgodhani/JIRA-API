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
  imageAddUpdateSchema,
  updateDeleteUserSchema,
  getImageSchema
} = require("../validations/user.validation");

const {
  validateBody,
  validateQuery,
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

router.post("/login", validateBody(userLoginSchema), userLogin);

router.post("/addUpdateImage",
  // upload.single('image'),
  validateBody(imageAddUpdateSchema),
   addUpdateImage
  );

router.get("/getImage",
  // upload.single('image'),
  validateQuery(getImageSchema),
  getUserImage
  );

router.put("/updateOrDelete", 
  verifyToken,
  validateBody(updateDeleteUserSchema), 
  updateOrDelete);

router.get("/getAll", 
  verifyToken,
  userGetAll);

module.exports = router;
