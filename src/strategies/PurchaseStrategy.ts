import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { validateReceipt, getReceipt, setupIAP } from '../services/iapService';
import { PurchaseService } from '../services/PurchaseService';

//Define the strategy interface
export interface IPurchaseStrategy {
    execute(userId: string, item: any, params: any, res: Response): Promise<void>;
}

export class CurrencyPurchaseStrategy implements IPurchaseStrategy {
    async execute(userId: string, item: any, params: any, res: Response): Promise<void> {
        const { platform, purchaseToken } = params;
        const receipt = getReceipt(platform, process.env.PACKAGE_NAME, item.itemId, purchaseToken);
        await setupIAP(platform);
        const isValid = await validateReceipt(platform, receipt, item.itemId);
        if (!isValid.errorMessage) {
            res.status(400).send('Invalid purchase receipt.');
            return;
        }
        await UserService.updateUserCoin(userId, item.itemAttributes.coinAmount);
        res.send('Purchase successful.');
    }
}

export class ItemPurchaseStrategy implements IPurchaseStrategy {
    async execute(userId: string, item: any, params: any, res: Response): Promise<void> {
        const totalCost = item.itemAttributes.price;
        if (params.userCoin < totalCost) {
            res.status(400).send('Insufficient coins.');
            return;
        }
        await UserService.updateUserCoin(userId, -totalCost);
        await PurchaseService.processPurchase(userId, item.itemId, totalCost, item.itemAttributes.contents);
        res.send('Purchase successful.');
    }
}