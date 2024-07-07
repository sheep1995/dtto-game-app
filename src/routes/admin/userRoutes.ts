import { Router } from 'express';
import { AdminController } from '../../controllers/admin/AdminController';

const _router: Router = Router({
    mergeParams: true,
});

_router.post('/register', AdminController.register);
_router.post('/login', AdminController.login);

export const router = _router;
