const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 
const { registerUser } = require('../controllers/authController'); 
const { loginUser } = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/authMiddleware'); 
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');



const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, 
    message: 'Too many login attempts. Please try again after 15 minutes.',
});

router.get('/', (req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET); 
            res.redirect('/profile');
        } catch (err) {
            console.error('Invalid or expired token:', err.message);
            res.clearCookie('token'); 
            res.render('login'); 
        }
    } else {
        res.render('login');
    }
});


router.post('/login', loginLimiter, loginUser);

router.post('/register', registerUser);

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/profile', authenticateJWT, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT username, email, created_at FROM users WHERE id = $1', [req.user.id]);

        if (rows.length === 0) {
            return res.status(404).send('User not found.');
        }

        const user = rows[0];
        res.render('profile', { user });
    } catch (err) {
        console.error('Error fetching user profile:', err.message);
        res.status(500).send('Internal server error.');
    }
});

router.post('/refresh-token', authenticateJWT, (req, res) => {

    const token = jwt.sign({ id: req.user.id, username: req.user.username }, process.env.JWT_SECRET, {
        expiresIn: '15m', 
    });

   
    res.cookie('token', token, { httpOnly: true });
    res.send({ message: 'Session refreshed successfully.' });
});


router.post('/logout', (req, res) => {
    res.clearCookie('token'); 
    res.render('logout-success');  
});




module.exports = router;

