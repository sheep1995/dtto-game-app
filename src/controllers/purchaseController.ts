import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { ItemService } from '../services/ItemService';
import { PurchaseService } from '../services/PurchaseService';
import { setupIAP, getReceipt, validateReceipt } from "../services/iapService";
import { TransactionService } from '../services/TransactionService';
import { VoucherService } from '../services/VoucherService';

export class PurchaseController {
    static async handleCurrencyPurchase(req: Request, res: Response): Promise<void> {
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

            // Write to the Transactions table
            await TransactionService.createTransaction({
                userId,
                itemId,
                price: item.itemAttributes.price,
                status: 'success',
                purchaseToken
            });

            await UserService.updateUserCoin(userId, coinAmount);

            res.send('Purchase successful.');
        } catch (error) {
            console.error('Purchase handling failed:', error);
            res.status(500).send('Internal server error.');
        }
    };

    static async handlePurchase(req: Request, res: Response): Promise<void> {
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
    };

    static async handleVoucherRedemption(req: Request, res: Response): Promise<void> {
        const { serialNumber: itemId } = req.body;
        const { userId } = req.user;

        try {
            const user = await UserService.getUserById(userId);
            const item = await ItemService.getItemById(itemId);

            if (!user || !item) {
                res.status(404).send('User or item not found.');
                return;
            }

            await VoucherService.redeemVoucher(userId, itemId, item.itemAttributes.contents);
            
            res.send('Voucher redeemed successfully.');
        } catch (error) {
            console.error('Voucher redemption failed:', error);
            res.status(500).send('Internal server error.');
        }
    }
}