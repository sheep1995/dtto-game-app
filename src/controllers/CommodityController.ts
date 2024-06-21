import { Request, Response } from 'express';
import { CommodityService } from '../services/CommodityService';

export class CommodityController {
  private commodityService = new CommodityService();

  async getAllCommodities(req: Request, res: Response) {
    try {
      const commodities = await this.commodityService.getAllCommodities();
      res.json(commodities);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createCommodity(req: Request, res: Response) {
    try {
      const commodity = await this.commodityService.createCommodity(req.body);
      res.status(201).json(commodity);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
