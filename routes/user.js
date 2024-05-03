// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/user');
// const authMiddleware = require('../middlewares/auth');
// const { body } = require('express-validator');

// // Handle the /users endpoint
// router.get('/', authMiddleware.authenticate, userController.getUsersList);
// router.get('/:userId', authMiddleware.authenticate, userController.getUserById);
// router.post('/', [
//     authMiddleware.authenticate,
//     // Input validation middleware using express-validator
//     body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
//     body('email').isEmail().withMessage('Invalid email address'),
// ], userController.addUser);

// module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for user management
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authMiddleware = require('../middlewares/auth');
const { body } = require('express-validator');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *             example:
 *               - id: 1
 *                 username: sammy
 *                 email: sammy@gmail.com
 *               - id: 2
 *                 username: andy
 *                 email: andy@gmail.com
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware.authenticate, userController.getUsersList);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:userId', authMiddleware.authenticate, userController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *           example:
 *             name: John Doe
 *             email: john@example.com
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', [
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
], authMiddleware.authenticate, userController.addUser);

module.exports = router;