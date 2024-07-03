import { AppDataSource } from '../config/data-source';
import { UserItem } from '../entities/UserItem';
import { Item } from '../entities/Item';
import { EntityManager } from "typeorm";

export class UserItemService {
    static async addItemToUser(
        userId: string,
        itemId: string,
        quantity: number,
        entityManager?: EntityManager
    ): Promise<void> {
        const transactionManager = entityManager || AppDataSource.manager;

        // Find existing userItem or create a new one
        const userItem = await transactionManager.findOne(UserItem, {
            where: { userId, itemId }
        });

        if (userItem) {
            userItem.quantity += quantity;
            await transactionManager.save(userItem);
        } else {
            const newUserItem = transactionManager.create(UserItem, {
                userId,
                itemId,
                quantity
            });
            await transactionManager.save(newUserItem);
        }
    }

    static getUserGameItems = async (userId: string) => {
        const itemRepository = AppDataSource.getRepository(Item);
        const userItemRepository = AppDataSource.getRepository(UserItem);

        // Get all game items
        const gameItems = await itemRepository.find({ where: { itemType: 'game_item' } });

        // Get user item quantities
        const userItems = await userItemRepository.find({ where: { userId } });

        // Map item quantities
        const itemsWithQuantities = gameItems.map(gameItem => {
            const userItem = userItems.find(ui => ui.itemId === gameItem.itemId);
            return {
                itemId: gameItem.itemId,
                itemName: gameItem.itemName,
                quantity: userItem ? userItem.quantity : 0
            };
        });

        return itemsWithQuantities;
    }

    static useItem = async(userId: string, itemId: string) => {
        const userItemRepository = AppDataSource.getRepository(UserItem);

        const userItem = await userItemRepository.findOne({ where: { userId, itemId } });

        if (!userItem || userItem.quantity < 1) {
            throw new Error('Insufficient item quantity.');
        }

        userItem.quantity -= 1;

        await userItemRepository.save(userItem);

        return userItem;
    }
}
