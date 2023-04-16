const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

const db = new sqlite3.Database('../src/db/students.db');
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS students (nick TEXT, name TEXT, surname TEXT)');
});

app.use(express.json());

app.get('/', (req, res) => {
    db.all('SELECT * FROM students', [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.send(rows);
        }
    });
});

app.post('/login', (req, res) => {
    const { nickname } = req.body;
    db.get('SELECT * FROM students WHERE nick = ?', [nickname], (err, row) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (!row) {
            res.status(404).send('Student not found');
        } else {
            const token = jwt.sign({ nickname }, 'secret');
            res.send({ token });
        }
    });
});

app.post('/students', (req, res) => {
    const { nickname, first_name, last_name } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send('Unauthorized');
        return;
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            res.status(401).send('Unauthorized');
        } else {
            db.run('INSERT INTO students (nick, name, surname) VALUES (?, ?, ?)', [nickname, first_name, last_name], (err) => {
                if (err) {
                    res.status(500).send(err.message);
                } else {
                    res.send('Student created successfully');
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});