import { AppDataSource } from '../config/data-source';
import { UserItem } from '../entities/UserItem';
import { Item } from '../entities/Item';
import { combineItemsLogic } from "../utils/combineItemsLogic";
import { In } from 'typeorm';

export class CombineService {
  private userItemRepository = AppDataSource.getRepository(UserItem);
  private itemRepository = AppDataSource.getRepository(Item);

  async hatchEgg(userId: string, itemId: string) {
    return await AppDataSource.transaction(async (transactionalEntityManager) => {
      // 检查用户是否有这个 CharacterEgg
      let userItem = await transactionalEntityManager.findOne(UserItem, {
        where: { userId, itemId },
      });

      if (!userItem || userItem.quantity < 1) {
        return { success: false, message: 'No CharacterEgg available to hatch' };
      }

      // 获取 CharacterEgg 的详细信息
      let item = await transactionalEntityManager.findOne(Item, {
        where: { itemId, itemType: 'CharacterEgg' },
      });

      if (!item) {
        return { success: false, message: 'CharacterEgg not found' };
      }

      const { items } = item.itemAttributes;

      if (!Array.isArray(items) || items.length === 0) {
        return { success: false, message: 'Invalid item attributes' };
      }

      // 批量读取 UserItems
      const itemIds = items.map(i => i.itemId);
      let userItems = await transactionalEntityManager.find(UserItem, {
        where: {
          userId,
          itemId: In(itemIds),
        },
      });

      // 创建一个 Map 来存储已存在的 UserItem
      const userItemMap = new Map(userItems.map(ui => [ui.itemId, ui]));

      // 处理每个 itemAttributes
      for (const { itemId: newItemId, quantity } of items) {
        if (!newItemId || !quantity) {
          return { success: false, message: 'Invalid item attributes' };
        }

        let userItem = userItemMap.get(newItemId);

        if (userItem) {
          userItem.quantity += quantity;
        } else {
          userItem = transactionalEntityManager.create(UserItem, {
            userId,
            itemId: newItemId,
            quantity: quantity,
          });
          userItemMap.set(newItemId, userItem);
        }
      }

      // 批量写入 UserItems
      await transactionalEntityManager.save([...userItemMap.values()]);

      // 将原始的 CharacterEgg 数量减 1
      userItem.quantity -= 1;
      if (userItem.quantity > 0) {
        await transactionalEntityManager.save(UserItem, userItem);
      } else {
        await transactionalEntityManager.remove(UserItem, userItem);
      }

      return { success: true, message: 'CharacterEgg hatched successfully' };
    });
  }

  async addCharacterEgg(userId: string, itemId: string, quantity: number) {
    return await AppDataSource.transaction(async (transactionalEntityManager) => {
      let userItem = await transactionalEntityManager.findOne(UserItem, {
        where: { userId, itemId },
      });

      if (userItem) {
        userItem.quantity += quantity;
      } else {
        userItem = transactionalEntityManager.create(UserItem, {
          userId,
          itemId,
          quantity,
        });
      }

      await transactionalEntityManager.save(UserItem, userItem);
      return { success: true, message: 'CharacterEgg added successfully' };
    });
  }

  async getCharacterEggs(userId: string) {
    return await AppDataSource.getRepository(UserItem).find({
      where: {
        userId,
        item: {
          itemType: 'CharacterEgg',
        },
      },
      relations: ['item'],
    });
  }

  async getCombineItems(userId: string) {
    return await AppDataSource.getRepository(UserItem).find({
      where: {
        userId,
        item: {
          itemType: 'CombineItem',
        },
      },
      relations: ['item'],
    });
  }

  async combineItems(userId: string, itemId: string) {
    return await AppDataSource.transaction(async (transactionalEntityManager) => {
      // 在查询时就进行过滤，获取所有用户的角色养成蛋物品
      const userItems = await transactionalEntityManager.createQueryBuilder(UserItem, 'userItem')
        .innerJoinAndSelect('userItem.item', 'item')
        .where('userItem.userId = :userId', { userId })
        .andWhere('item.itemType = :itemType', { itemType: 'CombineItem' })
        .getMany();

      console.log('userItems', userItems);
      if (userItems.length === 0) {
        return { success: false, message: 'No items to combine' };
      }

      // 将数据库记录转换为合成逻辑所需的格式
      let items = userItems.map(ui => ({
        level: ui.item.itemAttributes.level,
        quantity: ui.quantity,
      }));

      // 调用合成逻辑
      const combinedItems = combineItemsLogic(items);

      // 更新数据库的临时结构
      let updates = new Map<number, number>();

      for (let combinedItem of combinedItems) {
        updates.set(combinedItem.level, combinedItem.quantity);
      }

      // 将所有当前存在的等级添加到 updates 中
      for (let userItem of userItems) {
        if (!updates.has(userItem.item.itemAttributes.level)) {
          updates.set(userItem.item.itemAttributes.level, 0);
        }
      }

      console.log('updates', updates);

      // 批量更新数据库
      for (let [level, quantity] of updates) {
        let item = await transactionalEntityManager.createQueryBuilder(Item, 'item')
          .where('item.itemType = :itemType', { itemType: 'CombineItem' })
          .andWhere('JSON_EXTRACT(item.itemAttributes, "$.level") = :level', { level: level })
          .getOne();

        if (!item) {
          item = transactionalEntityManager.create(Item, {
            itemId: `combine${level}`,
            itemName: `combineItem${level}`,
            itemType: 'CombineItem',
            itemAttributes: { level: level },
            itemDescription: `A combine item of level ${level}`,
            createdTime: new Date(),
            updatedTime: new Date()
          });
          await transactionalEntityManager.save(Item, item);
        }

        let userItem = await transactionalEntityManager.findOne(UserItem, {
          where: { userId, itemId: item.itemId },
        });

        if (userItem) {
          userItem.quantity = quantity;
          await transactionalEntityManager.save(UserItem, userItem);
        } else {
          userItem = transactionalEntityManager.create(UserItem, {
            userId,
            itemId: item.itemId,
            quantity: quantity,
          });
          await transactionalEntityManager.save(UserItem, userItem);
        }
      }

      return { success: true, message: 'Items combined successfully' };
    });
  }
}
