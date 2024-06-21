import { AppDataSource } from '../config/data-source';
import { Commodities } from '../entities/Commodities';

export class CommodityService {
  private commodityRepository = AppDataSource.getRepository(Commodities);

  async getAllCommodities() {
    return this.commodityRepository.find({
      relations: ['commodityItems', 'commodityItems.item'],
    });
  }

  async createCommodity(commodityData: Partial<Commodities>) {
    const commodity = this.commodityRepository.create(commodityData);
    return this.commodityRepository.save(commodity);
  }
}
