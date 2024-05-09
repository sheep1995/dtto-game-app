import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import ScoreModel from '../models/ScoreModel';
import config from '../config';

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

async function addScore(req: Request, res: Response): Promise<void> {
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

export default { getPlayerScores, addScore };
