"use strict";
const sql = require("mssql");

let db = {
  username: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  server: process.env.MSSQL_SERVER,
  database: process.env.MSSQL_NAME,
  port: process.env.MSSQL_PORT ? Number(process.env.MSSQL_PORT) : 1433,
  dialect: process.env.MSSQL_DIALECT,
};

const config = {
  user: db.username,
  password: db.password,
  server: db.server,
  database: db.database,
  dialect: db.dialect,
  options: {
    trustedconnection: true,
    encrypt: false, //true if it is sql azure then we need to do this
    enableArithAbort: true,
    trustServerCertificate: true,
    instancename: "SQLEXPRESS", // SQL Server instance name - query to get server (SELECT SERVERPROPERTY ('InstanceName'))
  },
  port: db.port,
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("MSSQL Database Connected");
    return pool;
  })
  .catch((err) => {
    throw err;
  });

module.exports = {
  sql,
  poolPromise,
};

// module.exports = config;
