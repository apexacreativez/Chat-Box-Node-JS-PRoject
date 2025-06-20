const mysql = require('mysql2/promise');

const mySqlPool = mysql.createPool({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME,
  port     : process.env.DB_PORT || 26266,
  ssl      : {
    rejectUnauthorized: false
  }
});


module.exports = mySqlPool;