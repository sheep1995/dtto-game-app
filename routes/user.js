/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for user management
 */

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const authMiddleware = require('../middlewares/auth');
const { body, validationResult } = require('express-validator');

router.post('/login', [
    body('uId').isLength({ min: 3 }).withMessage('uId must be at least 3 characters long'),
    body('type').custom(value => {
        if (!Number.isInteger(value)) {
            throw new Error('type must be an integer');
        }

        if (value < 1 || value > 20) {
            throw new Error('type must be between 1 and 20');
        }
        return true;
    }),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const userControllerInstance = new UserController();
    userControllerInstance.login(req, res);
});

router.post('/refreshToken', authMiddleware.authenticate, (req, res) => {
    const userControllerInstance = new UserController();
    userControllerInstance.refreshToken(req, res);
});

module.exports = router;