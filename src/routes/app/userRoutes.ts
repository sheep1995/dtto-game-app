import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import { UserController, upload } from '../../controllers/UserController';
import authMiddleware from '../../middlewares/auth';
import validate from '../../middlewares/valiadationMiddleware';
import { loginType, uId, validateUserUpdate } from '../../validators/userValidator';

const _router: Router = Router({
    mergeParams: true,
});

_router.route('/login').post(validate([uId('uId'), loginType('loginType')]), UserController.login)

_router.post('/refreshToken', authMiddleware, UserController.refreshToken);

_router.get('/', UserController.getUserProfile);

_router.patch('/', validateUserUpdate, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, UserController.updateUser);

_router.post('/avatar', upload.single('avatar'), UserController.uploadAvatar);

export const router = _router;
