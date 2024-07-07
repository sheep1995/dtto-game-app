import { Router } from 'express';
import { UserItemController } from '../../controllers/UserItemController';

const _router = Router();

_router.get('/game-items', UserItemController.getUserGameItems);
_router.post('/:itemId/use', UserItemController.useItem);

export const router = _router;
