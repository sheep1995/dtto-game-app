import { Router } from 'express';
import { CombineController } from '../../controllers/CombineController';
import authMiddleware from '../../middlewares/auth';

const _router: Router = Router({
    mergeParams: true,
});
const combineController = new CombineController();

_router.post('/combine', combineController.combineItems);
_router.post('/hatchEgg', combineController.hatchEgg);
_router.post('/addCharacterEgg', combineController.addCharacterEgg);
_router.get('/getCharacterEggs/', combineController.getCharacterEggs);
_router.get('/getCombineItems/', combineController.getCombineItems);


export const router = _router;