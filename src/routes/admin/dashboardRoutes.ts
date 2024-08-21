import { Router } from 'express';
import { DashboardController } from '../../controllers/admin/DashboardController';

const _router: Router = Router({
    mergeParams: true,
});

_router.get('/metrics', DashboardController.getDashboardMetrics);
_router.get('/sales', DashboardController.getSalesStatistics);
_router.get('/realtime-metrics', DashboardController.getRealTimeMetrics);

export const router = _router;

