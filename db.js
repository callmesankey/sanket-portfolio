const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )`, (err) => {
            if (!err) {
                const password = "admin";
                bcrypt.hash(password, 10, (err, hash) => {
                    db.get(`SELECT * FROM users WHERE username = ?`, ['admin'], (err, row) => {
                        if (!row) {
                            db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ['admin', hash]);
                        }
                    });
                });
            }
        });

        // Create portfolio content table
        db.run(`CREATE TABLE IF NOT EXISTS portfolio_content (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            content TEXT
        )`, (err) => {
            if (!err) {
                db.get(`SELECT * FROM portfolio_content WHERE id = 1`, (err, row) => {
                    if (!row) {
                        const defaultContent = require('./defaultContent.json');
                        db.run(`INSERT INTO portfolio_content (id, content) VALUES (1, ?)`, [JSON.stringify(defaultContent)]);
                    }
                });
            }
        });
    }
});

module.exports = db;
