import { Request, Response } from 'express';
import { UserItemService } from '../services/UserItemService';

export class UserItemController {
    static async getUserGameItems (req: Request, res: Response): Promise<void> {
        const { userId } = req.params;

        try {
            const itemsWithQuantities = await UserItemService.getUserGameItems(userId);
            res.json(itemsWithQuantities);
        } catch (error) {
            console.error('Error fetching user game items:', error);
            res.status(500).send('Internal server error.');
        }
    };
    
    static async useItem (req: Request, res: Response): Promise<void> {
        const { itemId } = req.params;
        const { userId } = req.user;

        try {
            const updatedItem = await UserItemService.useItem(userId, itemId);
            res.json(updatedItem);
        } catch (error) {
            console.error('Error using item:', error);
            res.status(400).send(error.message);
        }
    };
}
