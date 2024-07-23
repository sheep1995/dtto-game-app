import { AppDataSource } from '../config/data-source';
import { MoreThan } from 'typeorm';
import { UserItem } from '../entities/UserItem';
import { Item } from '../entities/Item';

interface GachaItem {
    itemId: string;
    value: number;
}

interface DetailedGachaItem {
    itemId: string;
    itemName: string;
    level: number;
}

export async function drawGachaItem(items: GachaItem[]): Promise<DetailedGachaItem> {
    const totalProbability = items.reduce((total, item) => total + item.value, 0);
    let randomNumber = Math.random() * totalProbability;

    let selectedGachaItem = items[items.length - 1];  // Default to the last item as a fallback

    for (const item of items) {
        if (randomNumber < item.value) {
            selectedGachaItem = item;
            break;
        }
        randomNumber -= item.value;
    }

    const itemRepository = AppDataSource.getRepository(Item);
    const gachaItemInfo = await itemRepository.findOne({
        where: { itemId: selectedGachaItem.itemId }
    });

    if (!gachaItemInfo) {
        throw new Error(`Item not found`);  // Handle item not found scenario
    }

    return {
        itemId: gachaItemInfo.itemId,
        itemName: gachaItemInfo.itemName,
        level: 1
    };
}

export async function updateItems(usedItemId: string, itemId: string, userId: string) {
    const userItemRepository = AppDataSource.getRepository(UserItem);

    // 检查用户是否已经拥有该物品
    let userItem = await userItemRepository.findOne({
        where: { userId, itemId }
    });

    if (userItem) {
        // 如果已经拥有，则增加数量
        userItem.quantity += 1;
    } else {
        // 如果没有，则创建新的记录并设置初始数量
        userItem = userItemRepository.create({
            userId,
            itemId,
            quantity: 1
        });
    }

    await userItemRepository.save(userItem);

    // 减少使用的物品的数量
    const usedItem = await userItemRepository.findOne({
        where: {
            userId,
            itemId: usedItemId,
            quantity: MoreThan(0)  // 使用 TypeORM 的 MoreThan 函數來檢查數量
        }
    });

    if (usedItem) {
        if (usedItem.quantity >= 1) {
            usedItem.quantity -= 1;
            await userItemRepository.save(usedItem);
        } else {
            await userItemRepository.delete({ userId, itemId: usedItemId });
        }
    } else {
        throw new Error('Insufficient item quantity');
    }
}
