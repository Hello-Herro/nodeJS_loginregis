const mysql = require('mysql')
require('dotenv').config({ path: `${__dirname}/.env` })
const configDb = require('./config')

const connection = mysql.createConnection({
    host: configDb.host,
    user: configDb.user,
    port: configDb.port,
    password: configDb.password,
    database: configDb.database
})

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
});

module.exports = connection;