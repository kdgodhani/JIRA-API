const express = require("express");
require("./config/sql.db");
const apiRoute = require("./routes/index");
const errorHandler = require("./middlewares/error.handler");
const cors = require("cors");
const helmet = require('helmet')
const multer = require('multer')

const app = express();
app.use(helmet());   //check for security // basically it's check header
// const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true,limit:'50mb' }));

// this middleware for handle Multipart form data
app.use(multer().none());


app.use(
  cors({
    // origin: allowedOrigins,
    origin: "*",
  })
);
  
// API routes
app.use("/api/v1/", apiRoute);

app.use(errorHandler);

module.exports = app;
