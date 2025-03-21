const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token; 

    if (!token) {
        return res.status(401).send('Access denied. Please log in.');
    }

    try {
      
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (err) {
        console.error('Token error:', err.message);
        res.clearCookie('token'); 
        return res.redirect('/login'); 
    }
};

module.exports = { authenticateJWT };
