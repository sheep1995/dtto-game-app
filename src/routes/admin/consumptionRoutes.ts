import { Router } from 'express';
import { ConsumptionController } from '../..//controllers/admin/ConsumptionController';

const _router: Router = Router({
    mergeParams: true,
});

_router.get('/', ConsumptionController.getConsumptions);

export const router = _router;
