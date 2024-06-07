import { Commodity } from '../models/Commodity';
import { Item } from '../models/Item';

export class CommodityService {
  async getCommodityList(): Promise<Commodity[]> {
    const commodities = await Commodity.find({
      include: [Item],
    });
    return commodities;
  }
}