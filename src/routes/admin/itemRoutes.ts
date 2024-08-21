import { Router } from 'express';
import { CompensationController } from '../../controllers/admin/CompensationController';
import { ItemController } from '../../controllers/admin/ItemController';

const _router: Router = Router({
    mergeParams: true,
});

_router.post('/compensate', CompensationController.handleCompensation);
_router.get('/', ItemController.getItems);
_router.patch('/:itemId', ItemController.updateItem);

export const router = _router;
