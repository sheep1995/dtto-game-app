import { Request, Response } from 'express';
import { CombineService } from '../services/CombineService';

export class CombineController {
  private combineService: CombineService;

  constructor() {
    this.combineService = new CombineService();
  }

  combineItems = async (req: Request, res: Response) => {
    const { userId } = req.user;
    const { itemId } = req.body;

    try {
      const result = await this.combineService.combineItems(userId, itemId);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}
