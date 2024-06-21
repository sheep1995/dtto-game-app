import { Router } from 'express';
import { CombineController } from '../../controllers/CombineController';
import authMiddleware from '../../middlewares/auth';

const _router: Router = Router({
    mergeParams: true,
});
const combineController = new CombineController();

_router.post('/combine', combineController.combineItems);


export const router = _router;