const mysql = require('mysql')
require('dotenv').config({ path: `${__dirname}/.env` })

console.log(process.env);

module.exports = function getDB() {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    })
    return connection.connect()
}
