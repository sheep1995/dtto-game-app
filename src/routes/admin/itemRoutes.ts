import { Router } from 'express';
import { CompensationController } from '../../controllers/admin/CompensationController';

const _router: Router = Router({
    mergeParams: true,
});

_router.post('/compensate', CompensationController.handleCompensation);

export const router = _router;
