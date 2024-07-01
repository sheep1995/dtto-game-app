import { Router } from 'express';
import { CombineController } from '../../controllers/CombineController';
import authMiddleware from '../../middlewares/auth';

const _router: Router = Router({
    mergeParams: true,
});
const combineController = new CombineController();

// 获取合成道具列表
_router.get('/', authMiddleware, combineController.getCombineItems);
// 合成道具
_router.put('/', authMiddleware, combineController.combineItems);

export const router = _router;