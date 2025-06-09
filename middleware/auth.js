// src/middleware/authenticateToken.js (or authMiddleware.js)
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../Config/db');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token missing' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userIdFromToken = decoded.id;
        const userEmailFromToken = decoded.email;

        const [rows] = await db.query(
            'SELECT id, email FROM user_table WHERE id = ? AND email = ?',
            [userIdFromToken, userEmailFromToken]
        );

        if (!rows || rows.length === 0) {
            return res.status(401).json({ success: false, message: 'User not found or credentials mismatch.' });
        }

        const userFromDb = rows[0];
        const userEmailFromDb = userFromDb.email;

        if (userEmailFromToken !== userEmailFromDb) {
            console.warn(`Email mismatch for user ID ${userIdFromToken}: Token email '${userEmailFromToken}', DB email '${userEmailFromDb}'`);
            return res.status(401).json({ success: false, message: 'Token credentials mismatch with database.' });
        }

        req.user = userFromDb;

        next();

    } catch (err) {
        console.error("Authentication Error:", err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Access token expired' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid access token' });
        }
        return res.status(500).json({ success: false, message: 'Failed to authenticate token due to server error' });
    }
};

module.exports = authenticateToken;