import { Router } from 'express';
import { scoreController } from '../../controllers';
import authMiddleware from '../../middlewares/auth';
import validate from '../../middlewares/valiadationMiddleware';
import { gameModeOfBody, gameModeOfQuery, playTimeMs, score, period } from '../../validators/scoreValidator';

const _router: Router = Router({
    mergeParams: true,
});

_router.post('/record', validate([
    gameModeOfBody('gameMode'), playTimeMs('playTimeMs'), score('score')
]), authMiddleware, scoreController.addScoreRecord);

// _router.get('/best', validate([
//     gameMode('gameMode'), period('period')
// ]), authMiddleware, scoreController.getBestScore);

_router.get('/top-players', validate([
    gameModeOfQuery('gameMode'), period('period')
]), authMiddleware, scoreController.getTop100);

// _router.get('/ranking', validate([
//     gameMode('gameMode'), period('period')
// ]), authMiddleware, scoreController.getRanking);

export const router = _router;