import { Router } from 'express';
import { adController } from '../../controllers';
import authMiddleware from '../../middlewares/auth';
import validate from '../../middlewares/valiadationMiddleware';
import { adItemName } from '../../validators/adValidator';

const _router: Router = Router({
    mergeParams: true,
});

_router.post('/count', validate([adItemName('adItemName')]), authMiddleware, adController.setAdCount);
_router.get('/count', validate([ adItemName('adItemName') ]), authMiddleware, adController.getAdCount);
_router.put('/count/decrement', validate([ adItemName('adItemName') ]), authMiddleware, adController.decrementAdCount);

export const router = _router;