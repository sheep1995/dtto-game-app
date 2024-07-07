import { Router } from 'express';
import { AdController } from '../../controllers/AdController';
import authMiddleware from '../../middlewares/auth';
import validate from '../../middlewares/valiadationMiddleware';
import { adItemName } from '../../validators/adValidator';

const _router: Router = Router({
    mergeParams: true,
});

_router.post('/count', validate([adItemName('adItemName')]), authMiddleware, AdController.setAdCount);
_router.get('/count', validate([ adItemName('adItemName') ]), authMiddleware, AdController.getAdCount);
_router.put('/count/decrement', validate([ adItemName('adItemName') ]), authMiddleware, AdController.decrementAdCount);

export const router = _router;