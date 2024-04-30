const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const authMiddleware = require('../middlewares/auth');

// Handle the /users endpoint
router.get('/', authMiddleware.authenticate, UserController.getAllUsers);

// Add more routes for the /users endpoint as needed

module.exports = router;