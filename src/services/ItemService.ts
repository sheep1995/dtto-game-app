import { AppDataSource } from '../config/data-source';
import { Item } from '../entities/Item';

interface UpdateItemParams {
    itemName?: string;
    amortizable?: boolean;
}

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

    static async getItems(): Promise<any[]> {
        const itemRepository = AppDataSource.getRepository(Item);

        // Fetch all items from the database
        const items = await itemRepository.find();

        // Map items to the desired output format
        return items.map(item => ({
            id: item.itemId,
            type: item.itemType, // Assuming itemType corresponds to "iap", "voucher", etc.
            itemName: item.itemName,
            itemId: item.itemId,
            amortizable: false  // Defaulting to false for all items
        }));
    }

    static async updateItem(itemId: string, updateParams: UpdateItemParams): Promise<Item | null> {
        const itemRepository = AppDataSource.getRepository(Item);

        // Find the item by ID
        const item = await itemRepository.findOne({ where: { itemId } });

        if (!item) {
            return null;
        }

        // Update fields if they are provided
        if (updateParams.itemName !== undefined) {
            item.itemName = updateParams.itemName;
        }

        if (updateParams.amortizable !== undefined) {
            item.amortizable = updateParams.amortizable;
        }

        // Save the updated item back to the database
        await itemRepository.save(item);

        return item;
    }

}
