const express = require('express')
const bodyParser = require('body-parser')
const getDB = require('./database/db')
const jwt = require('jsonwebtoken');
const sha1 = require("sha1")

const app = express()
const port = 3000
console.log(__dirname);
require('dotenv').config({ path: `${__dirname}/.env` })

const db = getDB()

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/login', (req, res) => {
    const { username, password } = req.body

    const user = db.query(`SELECT u.id as userId, u.username, u.password FROM users u WHERE u.username = ${username}`, (err, rows, fields) => {
        db.release()
        if (err) return res.status(500).send('Internal server error')
        return rows[0]
    })[0]
    if (user.length == 0) return res.status(400).send('User not found')

    const encryptedPassword = sha1(password)
    if (encryptedPassword !== user.password) return res.status(400).send('Username or Password is wrong')

    const appSecret = process.env.APP_SECRET
    const token = jwt.sign(user.userId, appSecret, { expiresIn: 2 * 24 * 60 * 60 })

    return res.json({ message: 'Success', token: token })
})

app.post('/register', (req, res) => {
    const { username, password } = req.body

    const user = db.query(`SELECT u.id as userId, u.username, u.password FROM users u WHERE u.username = ${username}`, (err, rows, fields) => {
        db.release()
        if (err) return res.status(500).send('Internal server error')
    })[0]
    if (user.length != 0) return res.status(400).send('User is already exist')

    const encryptedPassword = sha1(password)

    db.query(`INSERT INTO users SET username = ${username}, password = ${encryptedPassword}`, (err, rows, fields) => {
        db.release()
        if (err) return res.status(500).send('Internal server error')
    })

    return res.json({ message: 'Success', token: token })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})