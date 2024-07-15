import { Router } from 'express';
import { UserTaskController } from '../../controllers/app/UserTaskController';

const _router = Router();

_router.get('/', UserTaskController.getTasks);
_router.post('/', UserTaskController.claimReward);

export const router = _router;
