import { Request, Response } from 'express';
import { CompensationService } from '../../services/CompensationService';

export class CompensationController {
    static async handleCompensation(req: Request, res: Response): Promise<void> {
        const { userId, itemId, quantity } = req.body;
        const { id: staffId } = req.staff;

        try {
            await CompensationService.compensateItem({ userId, itemId, quantity, staffId });
            res.send('Item compensated successfully.');
        } catch (error) {
            console.error('Compensation handling failed:', error);
            res.status(500).send('Internal server error.');
        }
    }
}
