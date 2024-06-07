import { Request, Response } from 'express';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import iapService from '../services/iapService';
import { logPurchaseError, executeTransaction } from '../models/purchaseModel';
import getCommodityList from '../services/commodityService2';

export function getDateWithOffset(offset: number = 0, timezone: string = 'Asia/Taipei'): string {
    const date = new Date();
    const zonedDate = toZonedTime(date, timezone);
    const formattedDate = format(zonedDate, 'yyyy/MM/dd HH:mm:ss');
    return formattedDate;
}

export const purchaseHandler = async (req: Request, res: Response) => {
    try {
        const now = getDateWithOffset();
        const { userId } = req.user;
        const { commodityId, platform, purchaseToken } = req.body;

        if (!commodityId || !platform) {
            return res.status(400).json({ status: 'error', message: '參數漏填' });
        }

        const { starCount, raiseCount, price } = getCommodityList(platform, commodityId);
        const totalGameCoin = starCount + raiseCount;

        const receipt = iapService.getReceipt(platform, process.env.PACKAGE_NAME, commodityId, purchaseToken);
        await iapService.setupIAP(platform);

        const { errorMessage, orderId } = await iapService.validateReceipt(platform, receipt, commodityId);

        if (errorMessage) {
            await logPurchaseError(userId, now, commodityId, errorMessage);
            throw new Error(errorMessage);
        }

        await executeTransaction({ userId, now, commodityId, totalGameCoin, price, purchaseToken, orderId });

        return res.status(200).json({ status: 'success', message: '購買成功' });
    } catch (e) {
        console.error('Error:', e);
        return res.status(500).json({ status: 'error', message: '操作失敗' });
    }
};
