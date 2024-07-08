import { NextFunction, Request, Response, Router } from 'express';
import { router as userRoutes } from './userRoutes';
import { router as itemRoutes } from './itemRoutes';
import { router as consumptionRoutes } from './consumptionRoutes';
import { router as dashboardRoutes } from './dashboardRoutes';

const _router: Router = Router({
    mergeParams: true,
});

//DEFINE API VERSION
_router.use(function (req: Request, res: Response, next: NextFunction) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// HEALTHCHECK
_router.route('/health-check').get(function (req: Request, res: Response) {
    return res.status(200).json({ healthy: true, version: 'v1' });
});

//EXPORT ROUTES WITH BASEPATH
_router.use('/users', userRoutes);
_router.use('/items', itemRoutes);
_router.use('/consumptions', consumptionRoutes);
_router.use('/dashboards', dashboardRoutes);


export const router = _router;