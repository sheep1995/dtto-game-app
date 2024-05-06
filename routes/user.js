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


/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     description: Logs in a user or creates a new user if not exists.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uId:
 *                 type: string
 *                 minLength: 3
 *               type:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 20
 *     responses:
 *       200:
 *         description: User logged in successfully or created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request. Validation error in user input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *       500:
 *         description: Internal server error. Something went wrong on the server side.
 *
 * /user/refreshToken:
 *   post:
 *     summary: Refresh user token
 *     tags: [Users]
 *     description: Refreshes the JWT token for an authenticated user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       500:
 *         description: Internal server error. Something went wrong on the server side.
 */

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