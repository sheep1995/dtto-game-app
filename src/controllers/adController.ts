import { Request, Response } from 'express';
import AdModel from '../models/AdModel';
import { getDateWithOffset } from '../utils';

const adModel = new AdModel();

async function getAdCount(req: Request, res: Response): Promise<void> {
    const adItemName = req.query.adItemName?.toString();
    const { userId } = req.user;

    try {
        const date = getDateWithOffset();
        const adCount = await adModel.getAdCount(adItemName, userId, date);

        res.json({ adCount });
    } catch (error) {
        console.error('Error getting ad count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function decrementAdCount(req: Request, res: Response): Promise<void> {
    const adItemName = req.query.adItemName?.toString();
    const { userId } = req.user;

    try {
        const date = getDateWithOffset();
        const adCount = await adModel.decrementAdCount(adItemName, userId, date);

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

async function setAdCount(req: Request, res: Response): Promise<void> {
    const adItemName = req.query.adItemName?.toString();
    const { userId } = req.user;
    const { count } = req.body;

    try {
        const date = getDateWithOffset();
        const adCount = await adModel.setAdCount(adItemName, userId, date, count);

        res.json({ adCount });
    } catch (error) {
        console.error('Error getting ad count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default { getAdCount, decrementAdCount, setAdCount };
