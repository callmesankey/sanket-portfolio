require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// API ROUTES
app.get('/api/content', async (req, res) => {
    const { data, error } = await db
        .from('portfolio_content')
        .select('content')
        .eq('id', 1)
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data.content);
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    const { data: user, error } = await db
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

    if (error || !user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({ token, message: 'Logged in successfully' });
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

app.put('/api/content', verifyToken, async (req, res) => {
    const newContent = req.body;

    const { error } = await db
        .from('portfolio_content')
        .upsert({ id: 1, content: newContent });

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: 'Content updated successfully' });
});

// FRONTEND SSR ROUTES
app.get('/', async (req, res) => {
    let seo = {
        title: "Sanket Dhital | Administrative & Operations Professional",
        description: "Sanket Dhital — Administrative & Operations Professional based in Kathmandu, Nepal.",
        image: "https://sanketdhital.com.np/og-image.png"
    };

    const { data, error } = await db
        .from('portfolio_content')
        .select('content')
        .eq('id', 1)
        .single();

    if (!error && data && data.content) {
        try {
            const content = data.content;
            if (content.hero && content.hero.eyebrow) {
                seo.title = `Sanket Dhital | ${content.hero.eyebrow}`;
            }
            if (content.hero && content.hero.subtitle) {
                seo.description = content.hero.subtitle;
            }
        } catch (e) {
            console.error('Error parsing SEO content', e);
        }
    }

    res.render('index', { seo });
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
