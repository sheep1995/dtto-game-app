import { Router } from 'express';
import { handlePurchase } from '../../controllers/PurchaseController';

const _router: Router = Router({
    mergeParams: true,
});

_router.post('/', handlePurchase);

export const router = _router;
