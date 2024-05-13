import { Request, Response } from 'express';
import ScoreModel from '../models/ScoreModel';

const scoreModel = new ScoreModel();

async function getPlayerScores(req: Request, res: Response): Promise<void> {
    const { userId } = req.user;

    try {
        const arcadeScores = await scoreModel.getScoresByGameMode(userId, 'Normal', 10);
        const survivalScores = await scoreModel.getScoresByGameMode(userId, 'LimitedTime', 10);
        const playerScores = {
            player: userId,
            arcade: arcadeScores,
            survival: survivalScores,
        };

        res.json(playerScores);
    } catch (error) {
        console.error('Error getting scores:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getTop100(req: Request, res: Response): Promise<void> {
    const gameMode = req.query.gameMode?.toString();

    try {
        const top = await scoreModel.getTop100(gameMode);
        res.json({ top });
    } catch (error) {
        console.error('Error getting scores:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function addScoreRecord(req: Request, res: Response): Promise<void> {
    const { score, playTimeMs, gameMode }: { score: number; playTimeMs: number; gameMode: string } = req.body;
    const { userId } = req.user;
    try {
        await scoreModel.addScore(userId, score, playTimeMs, gameMode);
        res.json({ message: `新增成功` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default { getPlayerScores, addScoreRecord, getTop100};
