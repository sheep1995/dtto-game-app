import { Request, Response } from 'express';
import { CombineService } from '../services/CombineService';

export class CombineController {
  private combineService: CombineService;

  constructor() {
    this.combineService = new CombineService();
  }

  hatchEgg = async (req: Request, res: Response) => {
    const { userId, itemId } = req.body;

    try {
      const result = await this.combineService.hatchEgg(userId, itemId);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  addCharacterEgg = async (req: Request, res: Response) => {
    const { userId, itemId, quantity } = req.body;

    try {
      const result = await this.combineService.addCharacterEgg(userId, itemId, quantity);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  getCharacterEggs = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const characterEggs = await this.combineService.getCharacterEggs(userId);
      return res.json(characterEggs);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  getCombineItems = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const combineItems = await this.combineService.getCombineItems(userId);
      return res.json(combineItems);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

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
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
}
