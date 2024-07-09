import { Router } from 'express';
import { AdController } from '../../controllers/AdController';
import authMiddleware from '../../middlewares/auth';
import validate from '../../middlewares/valiadationMiddleware';
import { type } from '../../validators/adValidator';

const _router: Router = Router({
    mergeParams: true,
});

_router.post('/count', validate([type('type')]), authMiddleware, AdController.decrementAdCount);
_router.get('/count', validate([ type('type') ]), authMiddleware, AdController.getAdCount);
_router.put('/count', validate([ type('type') ]), authMiddleware, AdController.setAdCount);

export const router = _router;