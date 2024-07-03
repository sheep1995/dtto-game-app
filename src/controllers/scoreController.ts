import { Request, Response } from 'express';
import { ScoreService } from '../services/ScoreService';

export class ScoreController {
    static recordScore = async (req: Request, res: Response): Promise<void> => {
        const { gameMode, score, playTimeMs } = req.body;
        const { userId } = req.user;

        try {
            const recordedScore = await ScoreService.recordScore(gameMode, userId, score, playTimeMs);
            res.json(recordedScore);
        } catch (error) {
            console.error('Error recording score:', error);
            res.status(400).send(error.message);
        }
    };

    static async getLeaderboard(req: Request, res: Response): Promise<void> {
        const { gameMode, timeFrame, page = 1 } = req.query;
        const { userId } = req.user;

        try {
            const leaderboard = await ScoreService.getTopScores(gameMode as string, timeFrame as string, userId, Number(page));
            res.json(leaderboard);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            res.status(400).send(error.message);
        }
    }
}
