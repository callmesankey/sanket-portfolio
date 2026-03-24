require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

let db = null;
try {
    db = require('./db');
} catch (e) {
    console.error('DB disabled on this environment:', e.message);
}

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// API ROUTES
app.get('/api/content', (req, res) => {
    if (!db) return res.status(503).json({ error: 'Database unavailable on this deployment' });

    db.get('SELECT content FROM portfolio_content WHERE id = 1', (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(JSON.parse(row.content));
    });
});

app.post('/api/auth/login', (req, res) => {
    if (!db) return res.status(503).json({ error: 'Login unavailable on this deployment' });

    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: 'Error checking password' });
            if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
            res.json({ token, message: 'Logged in successfully' });
        });
    });
});

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.user = decoded;
        next();
    });
};

app.put('/api/content', verifyToken, (req, res) => {
    if (!db) return res.status(503).json({ error: 'Content update unavailable on this deployment' });

    const newContent = req.body;
    db.run('UPDATE portfolio_content SET content = ? WHERE id = 1', [JSON.stringify(newContent)], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Content updated successfully' });
    });
});

// FRONTEND SSR ROUTES
app.get('/', (req, res) => {
    const seo = {
        title: "Sanket Dhital | Administrative & Operations Professional",
        description: "Sanket Dhital — Administrative & Operations Professional based in Kathmandu, Nepal.",
        image: "https://sanketdhital.com.np/og-image.png"
    };

    if (!db) {
        return res.render('index', { seo });
    }

    db.get('SELECT content FROM portfolio_content WHERE id = 1', (err, row) => {
        if (!err && row && row.content) {
            try {
                const data = JSON.parse(row.content);
                if (data.hero && data.hero.eyebrow) seo.title = `Sanket Dhital | ${data.hero.eyebrow}`;
                if (data.hero && data.hero.subtitle) seo.description = data.hero.subtitle;
            } catch (e) {
                console.error('Error parsing SEO content', e);
            }
        }

        res.render('index', { seo });
    });
});

app.get('/admin', (req, res) => {
    res.render('admin');
});

app.get('/index.html', (req, res) => res.redirect('/'));
app.get('/admin.html', (req, res) => res.redirect('/admin'));

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

module.exports = app;
