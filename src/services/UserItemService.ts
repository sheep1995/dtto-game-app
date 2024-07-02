import { AppDataSource } from '../config/data-source';
import { UserItem } from '../entities/UserItem';
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
}
