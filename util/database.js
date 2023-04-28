const mysql = require("mysql2")
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'eprediction',
    password: 'rootPassword#'
})
module.exports = pool.promise();