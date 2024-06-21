import { Router } from 'express';
import { CommodityController } from '../../controllers/CommodityController';

const _router = Router();
const commodityController = new CommodityController();

_router.get('/', (req, res) => commodityController.getAllCommodities(req, res));
_router.post('/', (req, res) => commodityController.createCommodity(req, res));

export const router = _router;
