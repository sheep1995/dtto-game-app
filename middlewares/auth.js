const jwt = require('jsonwebtoken');
const config = require('../config');

// Example authentication middleware using JWT
function authenticate(req, res, next) {
    // Get the token from the request headers
    const token = req.headers.authorization;

    // Check if token exists
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, config.JWT_SECRET); // JWT_SECRET should be replaced with your actual secret

        // Attach the decoded user information to the request object for use in subsequent middleware or route handlers
        req.user = decoded;

        // Call next to proceed to the next middleware or route handler
        next();
    } catch (error) {
        // If token verification fails, return a 401 Unauthorized response
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
}

module.exports = {
    authenticate,
};