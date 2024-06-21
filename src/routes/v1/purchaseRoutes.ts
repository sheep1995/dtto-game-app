// import { Router } from 'express';
// import { purchaseHandler } from '../../controllers/purchaseController';

// const _router: Router = Router({
//     mergeParams: true,
// });

// _router.post('/', purchaseHandler);

// export const router = _router;

import { Router } from 'express';
import { purchaseProduct } from '../../controllers/PurchaseControllerTest';

const _router = Router();

_router.post('/', purchaseProduct);

export const router = _router;
