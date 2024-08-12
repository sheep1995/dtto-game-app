import { Request, Response } from 'express';
import AdService from '../services/AdService';
import { getDateWithOffset } from '../utils';

export class AdController {
    static async getAdCount(req: Request, res: Response): Promise<void> {
        const type = req.query.type?.toString();
        const { userId } = req.user;
    
        try {
            const date = getDateWithOffset();
            const count = await AdService.getAdCount(type, userId, date);
    
            res.json({ count });
        } catch (error) {
            console.error('Error getting ad count:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    static async decrementAdCount(req: Request, res: Response): Promise<void> {
        const type = req.query.type?.toString();
        const { userId } = req.user;
    
        try {
            const date = getDateWithOffset();
            const count = await AdService.decrementAdCount(type, userId, date);
    
            res.json({ count });
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
        const type = req.query.type?.toString();
        const { userId } = req.user;
        const { adcount } = req.body;
    
        try {
            const date = getDateWithOffset();
            const count = await AdService.setAdCount(type, userId, date, adcount);
    
            res.json({ count });
        } catch (error) {
            console.error('Error getting ad count:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
