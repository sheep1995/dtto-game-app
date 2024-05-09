import { Request, Response, Router } from 'express';
import { scoreController } from '../../controllers';
import authMiddleware from '../../middlewares/auth';
import validate from '../../middlewares/valiadationMiddleware';
import { gameMode, playTimeMs, score } from '../../validators/scoreValidator';

const _router: Router = Router({
    mergeParams: true,
});

_router.post('/', validate([
    gameMode('gameMode'), playTimeMs('playTimeMs'), score('score')
]), authMiddleware, scoreController.addScore);

_router.get('/ranking', authMiddleware, scoreController.getPlayerScores);

export const router = _router;