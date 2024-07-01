import { AppDataSource } from '../config/data-source';
import { Item } from '../entities/Item';

export class ItemService {
    static async getItemById(itemId: string): Promise<Item | undefined> {
        return AppDataSource.manager.findOne(Item, { where: { itemId } });
    }
}
