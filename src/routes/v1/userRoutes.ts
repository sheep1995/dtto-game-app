import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import { userController } from '../../controllers';
import authMiddleware from '../../middlewares/auth';
import validate from '../../middlewares/valiadationMiddleware';
import { loginType, uId } from '../../validators/userValidator';

const _router: Router = Router({
    mergeParams: true,
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for user management
 */

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
 */
_router.route('/login').post(validate([uId('uId'), loginType('type')]), userController.login)

/**
 * @swagger
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
_router.post('/refreshToken', authMiddleware, userController.refreshToken);

export const router = _router;
