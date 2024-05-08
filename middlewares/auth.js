const jwt = require('jsonwebtoken');
const config = require('../config');
const UserModel = require('../models/user');

// Example authentication middleware using JWT
async function authenticate(req, res, next) {
    // Get the token from the request headers
    const token = req.headers.authorization;

    // Check if token exists
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const { uId, userId, type } = jwt.verify(token, config.JWT_SECRET); // JWT_SECRET should be replaced with your actual secret

        const userModel = new UserModel();
        const user = await userModel.getUser(uId);

        // Check if user exists and if the userId and type match the decoded token
        if (!user || user.userId !== userId || user.type !== type) {
            return res.status(401).json({ error: 'Unauthorized: Invalid user' });
        }

        // Attach the decoded user information to the request object for use in subsequent middleware or route handlers
        req.user = user;

        // Call next to proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.log('Unauthorized:', error)
        if (error.message === 'jwt expired') {
            return res.status(403).json({ error: 'Unauthorized: Token expired' });
        } else {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
    }
}

module.exports = {
    authenticate,
};