const bcrypt = require('bcrypt');
const pool = require('../config/db'); 
const jwt = require('jsonwebtoken');
const axios = require('axios');

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    
    if (!username || !email || !password || password.length < 8) {
        return res.status(400).send('Invalid input. Ensure all fields are filled and the password is at least 8 characters.');
    }

    try {
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );
        if (existingUser.rows.length > 0) {
            return res.status(400).send('Username or email already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
            [username, email, hashedPassword]
        );

        res.render('signup-success');
    } catch (err) {
        console.error('Error registering user:', err.message);
        res.status(500).send('Internal server error.');
    }
};

const loginUser = async (req, res) => {
    const { usernameOrEmail, password, 'g-recaptcha-response': recaptchaResponse } = req.body;
    if (!usernameOrEmail || !password || password.length < 8) {
        return res.status(400).send('All fields are required, and password must be at least 8 characters long.');
    }
    
    if (!recaptchaResponse) {
        return res.status(400).send('Please complete the reCAPTCHA.');
    }

    try {
        const verifyRecaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;
        const { data } = await axios.post(verifyRecaptchaUrl);

        if (!data.success) {
            return res.status(400).send('reCAPTCHA verification failed.');
        }

        const userQuery = `
            SELECT * FROM users WHERE username = $1 OR email = $1
        `;
        const { rows } = await pool.query(userQuery, [usernameOrEmail]);

        if (rows.length === 0) {
            return res.status(400).send('User not found.');
        }

        const user = rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid credentials.');
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h', 
        });

       
        res.cookie('token', token, { httpOnly: true });
        // res.send('Login successful!');
        res.redirect('/profile');
    } catch (err) {
        console.error('Error logging in:', err.message);
        res.status(500).send('Internal server error.');
    }
};

module.exports = { registerUser, loginUser };
