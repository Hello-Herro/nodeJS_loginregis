const express = require('express')
const bodyParser = require('body-parser')
const db = require('./database/db')
const jwt = require('jsonwebtoken');
const sha1 = require("sha1")
const { v4: uuidv4 } = require('uuid');

const app = express()
const port = 3000
console.log(__dirname);
require('dotenv').config({ path: `${__dirname}/.env` })

// const db = getDB()

app.use(express.json({ limit: '4mb' }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.urlencoded({ // to support URL-encoded bodies
    limit: '4mb',
    extended: true
}));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/login', async(req, res) => {
    const { username, password } = req.body

    console.log(username, password)
    db.query(`SELECT u.id as userId, u.username, u.password FROM users u WHERE u.username = ?`, [username], (err, rows, fields) => {
        if (err) {
            console.error('Error querying database: ' + err.stack);
            return res.status(500).send('Internal server error');
        }

        if (rows.length === 0) return res.status(400).send('User not found');

        const user = rows[0];
        const encryptedPassword = sha1(password);
        if (encryptedPassword !== user.password) return res.status(400).send('Username or Password is wrong');

        const token = uuidv4();

        return res.status(200).json({ success: true, message: 'Berhasil Login', data: { token } });
    });
});

app.post('/register', async(req, res) => {
    const username = req.body.username
    const password = req.body.password

    db.query(`SELECT u.id as userId, u.username, u.password FROM users u WHERE u.username = ?`, [username], (err, rows, fields) => {
        if (err) {
            console.error('Error querying database: ' + err.stack);
            return res.status(500).send('Internal server error');
        }

        if (rows.length !== 0) return res.status(400).send('User is already exist');

        const encryptedPassword = sha1(password);

        db.query(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, encryptedPassword], (err, result) => {
            if (err) {
                console.error('Error querying database: ' + err.stack);
                return res.status(500).send('Internal server error');
            }

            const token = uuidv4();

            return res.json({ success: true, message: 'Berhasil Register', data: token });
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})