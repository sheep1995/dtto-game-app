import { Router } from 'express';
import { purchaseHandler } from '../../controllers/purchaseController';

const _router: Router = Router({
    mergeParams: true,
});

_router.post('/', purchaseHandler);

export const router = _router;
