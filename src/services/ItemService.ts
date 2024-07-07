import { AppDataSource } from '../config/data-source';
import { Item } from '../entities/Item';

export class ItemService {
    static async getItemById(itemId: string): Promise<Item | undefined> {
        return AppDataSource.manager.findOne(Item, { where: { itemId } });
    }

    static async getItemBySerialNumber(serialNumber: string): Promise<Item | null> {
        const itemRepository = AppDataSource.getRepository(Item);

        const item = await itemRepository.findOne({
            where: {
                itemId: serialNumber,
                itemType: 'voucher',
            },
        });

        return item;
    }

}
