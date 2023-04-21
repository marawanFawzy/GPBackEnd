const mysql = require("mysql2")
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'Epidemic_Prediction',
    password: 'rootPassword#'
})
module.exports = pool.promise();