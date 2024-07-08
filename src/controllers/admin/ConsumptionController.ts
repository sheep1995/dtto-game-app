import { Request, Response } from 'express';
import { ConsumptionService } from '../../services/ConsumptionService';

export class ConsumptionController {
    static async getConsumptions(req: Request, res: Response): Promise<void> {
        const { userId, startDate, endDate, sortBy, page, pageSize } = req.query;

        try {
            const consumptions = await ConsumptionService.getConsumptions({
                userId: userId as string,
                startDate: startDate as string,
                endDate: endDate as string,
                sortBy: sortBy as string,
                page: parseInt(page as string, 10) || 1,
                pageSize: parseInt(pageSize as string, 10) || 20
            });
            res.status(200).json(consumptions);
        } catch (error) {
            console.error('Failed to get consumptions:', error);
            res.status(500).send('Internal server error.');
        }
    }
}
