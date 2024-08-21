import { Request, Response } from 'express';
import { ItemService } from '../../services/ItemService';

export class ItemController {
    static async getItems(req: Request, res: Response): Promise<void> {
        try {
            const items = await ItemService.getItems();
            res.status(200).json(items);
        } catch (error) {
            console.error('Failed to get items:', error);
            res.status(500).send('Internal server error.');
        }
    }

    static async updateItem(req: Request, res: Response): Promise<void> {
        const { itemId } = req.params;
        const { itemName, amortizable } = req.body;

        try {
            const updatedItem = await ItemService.updateItem(itemId, { itemName, amortizable });
            if (updatedItem) {
                res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
            } else {
                res.status(404).json({ message: 'Item not found' });
            }
        } catch (error) {
            console.error('Failed to update item:', error);
            res.status(500).send('Internal server error.');
        }
    }
}
