import { Router } from 'express';
import { GachaController } from '../../controllers/app/GachaController';

const _router = Router();

_router.post('/', GachaController.gacha);

export const router = _router;
