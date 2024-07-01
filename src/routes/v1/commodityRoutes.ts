import { Router } from 'express';
import { CommodityController } from '../../controllers/CommodityController';

const _router = Router();

_router.get('/', (req, res) => CommodityController.getAllCommodities(req, res));
_router.get('/currency', (req, res) => CommodityController.getAllCurrencyCommodities(req, res));

export const router = _router;
