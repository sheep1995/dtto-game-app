import { AppDataSource } from '../config/data-source';
import { UserItem } from '../entities/UserItem';

export class UserItemService {
    static async addItemToUser(userId: string, itemId: string, quantity: number): Promise<void> {
        console.debug('addItemToUser', userId);
        const userItem = await AppDataSource.manager.findOne(UserItem, {
            where: { userId, itemId }
        });

        if (userItem) {
            userItem.quantity += quantity;
            await AppDataSource.manager.save(userItem);
        } else {
            const newUserItem = AppDataSource.manager.create(UserItem, {
                userId,
                itemId,
                quantity
            });
            await AppDataSource.manager.save(newUserItem);
        }
    }
}
