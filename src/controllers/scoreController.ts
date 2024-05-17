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
    const period = req.query.period?.toString();

    try {
        const top = await scoreModel.getTop100ByRedis(gameMode, period);
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
        await scoreModel.addScoreToRedis(userId, score, gameMode);
        res.json({ message: `新增成功` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getRanking(req: Request, res: Response): Promise<void> {
    const gameMode = req.query.gameMode?.toString();
    const period = req.query.period?.toString();
    const { userId } = req.user;
    try {
        const ranking = await scoreModel.getRankingByRedis(userId, gameMode, period);
        res.json({ ranking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default { getPlayerScores, addScoreRecord, getTop100, getRanking};
