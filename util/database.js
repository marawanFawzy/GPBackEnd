const mysql = require("mysql2")
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'name',
    password: 'pass'
})
module.exports = pool.promise();