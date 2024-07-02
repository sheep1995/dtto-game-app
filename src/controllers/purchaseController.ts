/*import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { ItemService } from '../services/ItemService';
import { PurchaseService } from '../services/PurchaseService';
import { setupIAP, getReceipt, validateReceipt } from "../services/iapService";

export const handleCurrencyPurchase = async (req: Request, res: Response): Promise<void> => {
    const { itemId, platform, purchaseToken } = req.body;
    const { userId } = req.user;

    try {
        const user = await UserService.getUserById(userId);
        const item = await ItemService.getItemById(itemId);

        if (!user || !item) {
            res.status(404).send('User or item not found.');
            return;
        }

        const receipt = getReceipt(platform, process.env.PACKAGE_NAME, itemId, purchaseToken);
        await setupIAP(platform);

        const isValid = await validateReceipt(platform, receipt, itemId);
        if (!isValid.errorMessage) {
            res.status(400).send('Invalid purchase receipt.');
            return;
        }

        console.debug('price', item);

        const coinAmount = item.itemAttributes.coinAmount;

        await UserService.updateUserCoin(userId, coinAmount);

        res.send('Purchase successful.');
    } catch (error) {
        console.error('Purchase handling failed:', error);
        res.status(500).send('Internal server error.');
    }
};

export const handlePurchase = async (req: Request, res: Response): Promise<void> => {
    const { itemId } = req.body;
    const { userId } = req.user;

    try {
        const user = await UserService.getUserById(userId);
        const item = await ItemService.getItemById(itemId);

        if (!user || !item) {
            res.status(404).send('User or item not found.');
            return;
        }

        const totalCost = item.itemAttributes.price;

        await PurchaseService.processPurchase(userId, itemId, totalCost, item.itemAttributes.contents);

        res.send('Purchase successful.');
    } catch (error) {
        console.error('Purchase handling failed:', error);
        res.status(500).send('Internal server error.');
    }
};*/

// purchase-controller.ts
import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { ItemService } from '../services/ItemService';
import { IPurchaseStrategy, CurrencyPurchaseStrategy, ItemPurchaseStrategy } from '../strategies/PurchaseStrategy';

const strategies: { [key: string]: IPurchaseStrategy } = {
    currency: new CurrencyPurchaseStrategy(),
    item: new ItemPurchaseStrategy()
};

export class PurchaseController {
    static handlePurchase = async (req: Request, res: Response): Promise<void> => {
        const { itemId, } = req.body;
        const purchaseType = req.query.purchaseType as string;
        const { userId } = req.user;

        try {
            const item = await ItemService.getItemById(itemId);
            const user = await UserService.getUserById(userId);
            if (!item || !user) {
                res.status(404).send('User or item not found.');
                return;
            }

            const strategy = strategies[purchaseType];
            if (!strategy) {
                res.status(400).send('Invalid purchase type.');
                return;
            }

            await strategy.execute(userId, item, { platform: req.body.platform, purchaseToken: req.body.purchaseToken, userCoin: user.coin }, res);
        } catch (error) {
            console.error('Purchase handling failed:', error);
            res.status(500).send('Internal server error.');
        }
    }
}
