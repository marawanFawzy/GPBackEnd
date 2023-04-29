const mysql = require("mysql2")
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'eprediction',
    password: process.env.secretdb
})
module.exports = pool.promise();