import { NextFunction, Request, Response, Router } from 'express';
import { router as UserRouter } from './userRoutes';
import { router as ScoreRoutes } from './scoreRoutes';
import { router as AdRoutes } from './adRoutes';
import { router as PurchaseRoutes } from './purchaseRoutes';
import { router as CommodityRoutes  } from './commodityRoutes';
import { router as CharacterRoutes  } from './characterRoutes';

const _router: Router = Router({
    mergeParams: true,
});

//DEFINE API VERSION
_router.use(function (req: Request, res: Response, next: NextFunction) {
    res.setHeader('Api-Version', 'v1');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// HEALTHCHECK
_router.route('/v1/health-check').get(function (req: Request, res: Response) {
    return res.status(200).json({ healthy: true, version: 'v1' });
});

//EXPORT ROUTES WITH BASEPATH
_router.use('/v1/user', UserRouter);
_router.use('/v1/scores', ScoreRoutes);
_router.use('/v1/ads', AdRoutes);
_router.use('/v1/purchase', PurchaseRoutes);
_router.use('/v1/commodities', CommodityRoutes);
_router.use('/v1/character', CharacterRoutes);

export const router = _router;