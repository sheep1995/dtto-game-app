import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Item } from '../../entities/Item';
import { drawGachaItem, updateItems } from '../../services/GachaService';

export class GachaController {
    static async gacha(req: Request, res: Response) {
        const { userId } = req.user;
        const {voucherType: itemId} = req.body;

        try {
            const itemRepository = AppDataSource.getRepository(Item);

            const item = await itemRepository.findOne({ where: { itemId } });

            if (!item) {
                return res.status(404).json({ errorMessage: 'Item not found' });
            }

            // Proceed with the gacha draw
            const drawnItem = await drawGachaItem(item.itemAttributes.probabilities);
            await updateItems(itemId, drawnItem.itemId, userId); // Assume updateItems handles quantity updates
            res.json(drawnItem);

        } catch (error) {
            console.error(error);
            if (error.message === 'Item not found') {
                res.status(404).json({ errorMessage: 'Item not found' });
            } else if (error.message === 'Insufficient item quantity') {
                res.status(400).json({ errorMessage: 'Insufficient item quantity' });
            } else {
                res.status(500).json({ errorMessage: 'Internal server error' });
            }
        }
    }
}

