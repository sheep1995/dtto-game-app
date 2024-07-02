import { Router } from 'express';
import { CommodityController } from '../../controllers/CommodityController';
import { PurchaseController } from '../../controllers/PurchaseController';

const _router = Router();

_router.get('/', (req, res) => CommodityController.getAllCommodities(req, res));
_router.get('/currency', (req, res) => CommodityController.getAllCurrencyCommodities(req, res));
_router.post('/purchase', (req, res) => PurchaseController.handlePurchase(req, res));

export const router = _router;
