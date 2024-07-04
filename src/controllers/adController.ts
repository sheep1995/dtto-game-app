import { Request, Response } from 'express';
import AdService from '../services/AdService';
import { getDateWithOffset } from '../utils';

export class AdController {
    static async getAdCount(req: Request, res: Response): Promise<void> {
        const adItemName = req.query.adItemName?.toString();
        const { userId } = req.user;
    
        try {
            const date = getDateWithOffset();
            const adCount = await AdService.getAdCount(adItemName, userId, date);
    
            res.json({ adCount });
        } catch (error) {
            console.error('Error getting ad count:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    static async decrementAdCount(req: Request, res: Response): Promise<void> {
        const adItemName = req.query.adItemName?.toString();
        const { userId } = req.user;
    
        try {
            const date = getDateWithOffset();
            const adCount = await AdService.decrementAdCount(adItemName, userId, date);
    
            res.json({ adCount });
        } catch (error) {
            console.error('Error getting ad count:', error);
            if (error.message === 'Count is already zero') {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
    
    static async setAdCount(req: Request, res: Response): Promise<void> {
        const adItemName = req.query.adItemName?.toString();
        const { userId } = req.user;
        const { count } = req.body;
    
        try {
            const date = getDateWithOffset();
            const adCount = await AdService.setAdCount(adItemName, userId, date, count);
    
            res.json({ adCount });
        } catch (error) {
            console.error('Error getting ad count:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
