import { Request, Response } from 'express';
import { CommodityService } from '../services/CommodityService';
import { Commodity } from '../models/Commodity';

export class CommodityController {
    constructor(private readonly commodityService: CommodityService) {}
  
    async getCommodityList(req: Request, res: Response) {
      const commodities = await this.commodityService.getCommodityList();
      res.json(commodities);
    }
  }