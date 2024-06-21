import { AppDataSource } from '../config/data-source';
import { UserItem } from '../entities/UserItem';
import { Item } from '../entities/Item';

export class CombineService {
  private userItemRepository = AppDataSource.getRepository(UserItem);
  private itemRepository = AppDataSource.getRepository(Item);

  async combineItems(userId: string, itemId: string) {
    const userItems = await this.userItemRepository.find({ where: { userId, itemId } });

    if (userItems.length < 2) {
      return { success: false, message: 'Not enough items to combine' };
    }

    const item = await this.itemRepository.findOne({ where: { itemId } });

    if (!item) {
      return { success: false, message: 'Item not found' };
    }

    if (item.itemType !== '角色養成蛋' || !item.itemAttributes.level) {
      return { success: false, message: 'Item cannot be combined' };
    }

    const newLevel = item.itemAttributes.level + 1;

    // 減少原始物品數量
    userItems.forEach(userItem => userItem.quantity -= 2);
    await this.userItemRepository.save(userItems);

    // 檢查是否已有更高等級的物品
    let newItem = await this.itemRepository.findOne({ where: { itemType: '角色養成蛋', itemAttributes: { level: newLevel } } });

    if (newItem) {
      let newUserItem = await this.userItemRepository.findOne({ where: { userId, itemId: newItem.itemId } });
      if (newUserItem) {
        newUserItem.quantity += 1;
        await this.userItemRepository.save(newUserItem);
      } else {
        newUserItem = this.userItemRepository.create({
          userId,
          itemId: newItem.itemId,
          quantity: 1
        });
        await this.userItemRepository.save(newUserItem);
      }
    } else {
      newItem = this.itemRepository.create({
        itemName: item.itemName,
        itemType: item.itemType,
        itemAttributes: { ...item.itemAttributes, level: newLevel },
        itemDescription: item.itemDescription,
        createdTime: new Date(),
        updatedTime: new Date()
      });
      await this.itemRepository.save(newItem);

      const newUserItem = this.userItemRepository.create({
        userId,
        itemId: newItem.itemId,
        quantity: 1
      });
      await this.userItemRepository.save(newUserItem);
    }

    return { success: true, newItem, message: `Combined to create item of level ${newLevel}` };
  }
}
