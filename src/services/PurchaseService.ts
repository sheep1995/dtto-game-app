import { AppDataSource } from "../config/data-source";
import { UserService } from './UserService';
import { UserItemService } from './UserItemService';

interface PurchaseContent {
    itemId: string;
    quantity: number;
}

export class PurchaseService {
    static async processPurchase(userId: string, itemId: string, totalCost: number, contents: PurchaseContent[]) {
        try {
            await AppDataSource.transaction(async transactionalEntityManager => {
                await UserService.updateUserCoin(userId, -totalCost, transactionalEntityManager);

                for (const content of contents) {
                    await UserItemService.addItemToUser(userId, content.itemId, content.quantity, transactionalEntityManager);
                }
            });
        } catch (error) {
            // Handle errors, possibly logging them or throwing custom exceptions
            console.error('Failed to process purchase:', error);
            throw new Error('Transaction failed, purchase could not be processed.');
        }
    }
}
