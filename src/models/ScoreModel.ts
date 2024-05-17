import { Pool, PoolConnection } from 'mysql2/promise';
import pool from '../database';
import Redis from 'ioredis';
import { getDateWithOffset } from '../utils';
import { Score } from './score';

const redis = new Redis();

class ScoreModel {
    private pool: Pool;
    private connection?: PoolConnection;

    constructor() {
        this.pool = pool;
    }

    private async initConnection(): Promise<void> {
        if (!this.connection) {
            this.connection = await this.pool.getConnection();
        }
    }

    private async releaseConnection(): Promise<void> {
        if (this.connection) {
            this.connection.release();
            this.connection = undefined; // 釋放後重置連接
        }
    }

    private async getCachedScores(cacheKey: string): Promise<Score[] | null> {
        try {
            const cachedData = await redis.get(cacheKey);
            return cachedData ? JSON.parse(cachedData) : null;
        } catch (error) {
            console.error('Error getting scores from Redis:', error);
            return null;
        }
    }

    private async cacheScores(cacheKey: string, scores: Score[]): Promise<void> {
        try {
            await redis.set(cacheKey, JSON.stringify(scores));
        } catch (error) {
            console.error('Error setting scores to Redis:', error);
        }
    }

    async getScoresByGameMode(userId: string, gameMode: string, limit: number): Promise<Score[]> {
        const cacheKey = `user:${userId}:gameMode:${gameMode}:scores`;
        console.debug('cacheKey', cacheKey);

        const cachedScores = await this.getCachedScores(cacheKey);
        if (cachedScores) {
            return cachedScores;
        } else {
            const scores = await this.fetchScoresFromDatabase(userId, gameMode, limit);
            await this.cacheScores(cacheKey, scores);
            return scores;
        }
    }

    private async fetchScoresFromDatabase(userId: string, gameMode: string, limit: number): Promise<Score[]> {
        await this.initConnection();
        try {
            if (!this.connection) {
                throw new Error('Database connection is not initialized.');
            }
            const sql = `SELECT * FROM Scores_${gameMode} WHERE userId = ? ORDER BY score DESC LIMIT ?`;
            const [rows] = await this.connection.query(sql, [userId, limit]);
            return rows as Score[];
        } catch (error) {
            console.error('Error fetching scores from database:', error);
            throw error;
        } finally {
            await this.releaseConnection();
        }
    }

    async getTop100(gameMode: string): Promise<Score[]> {
        await this.initConnection();
        try {
            if (!this.connection) {
                throw new Error('Database connection is not initialized.');
            }
            const sql = `SELECT * FROM Scores_${gameMode} ORDER BY score DESC LIMIT 100`;
            const [rows] = await this.connection.query(sql);
            return rows as Score[];
        } catch (error) {
            console.error('Error fetching top 100 scores from database:', error);
            throw error;
        } finally {
            await this.releaseConnection();
        }
    }

    async addScore(userId: string, score: number, playTimeMs: number, gameMode: string): Promise<void> {
        await this.initConnection();
        try {
            if (!this.connection) {
                throw new Error('Database connection is not initialized.');
            }
            const sql = `INSERT INTO Scores_${gameMode} (userId, score, playTimeMs) VALUES (?, ?, ?)`;
            await this.connection.query(sql, [userId, score, playTimeMs]);
        } catch (error) {
            console.error('Error adding score to database:', error);
            throw error;
        } finally {
            await this.releaseConnection();
        }
    }

    async addScoreToRedis(userId: string, score: number, gameMode: string): Promise<void> {
        const date = getDateWithOffset();
        try {
            await redis.zadd(`Scores_${gameMode}`, 'GT', score.toString(), userId);
            await redis.zadd(`Scores_${gameMode}_${date}`, 'GT', score.toString(), userId);
        } catch (error) {
            console.error('Error adding score to Redis:', error);
            throw error;
        }
    }

    private parseRankingResult(rawData: string[]): { ranking: number; userId: string; score: number }[] {
        const parsedResult: { ranking: number; userId: string; score: number }[] = [];
        for (let i = 0; i < rawData.length; i += 2) {
            const userId = rawData[i];
            const score = parseInt(rawData[i + 1]);
            const ranking = i / 2 + 1;
            parsedResult.push({ ranking, userId, score });
        }
        return parsedResult;
    }

    async getTop100ByRedis(gameMode: string, period: string): Promise<{ ranking: number; userId: string; score: number }[]> {
        try {
            let rawData: string[] = [];

            if (period === 'today') {
                const date = getDateWithOffset();
                rawData = await redis.zrevrange(`Scores_${gameMode}_${date}`, 0, 99, 'WITHSCORES');
            } else if (period === 'thisWeek') {
                const sourceLeaderboards: string[] = [];
                for (let i = 0; i < 7; i++) {
                    const date = getDateWithOffset(i);
                    sourceLeaderboards.push(`Scores_${gameMode}_${date}`);
                }
                await redis.zunionstore('combined', sourceLeaderboards.length, ...sourceLeaderboards, 'AGGREGATE', 'MAX');
                rawData = await redis.zrevrange('combined', 0, 99, 'WITHSCORES');
            } else if (period === 'allTime') {
                rawData = await redis.zrevrange(`Scores_${gameMode}`, 0, 99, 'WITHSCORES');
            }

            const result = this.parseRankingResult(rawData);
            console.debug('result', result);
            return result;
        } catch (error) {
            console.error('Error getting top 100 scores from Redis:', error);
            throw error;
        }
    }

    async getRankingByRedis(userId: string, gameMode: string, period: string): Promise<number | null> {
        const getRank = async (key: string, userId: string): Promise<number | null> => {
            const rank = await redis.zrevrank(key, userId);
            return rank !== null ? rank + 1 : null;
        };

        try {
            let rank: number | null = null;

            if (period === 'today') {
                const date = getDateWithOffset();
                rank = await getRank(`Scores_${gameMode}_${date}`, userId);
            } else if (period === 'thisWeek') {
                const sourceLeaderboards: string[] = [];
                for (let i = 0; i < 7; i++) {
                    const date = getDateWithOffset(i);
                    sourceLeaderboards.push(`Scores_${gameMode}_${date}`);
                }
                const tempKey = `combined_${gameMode}_${Date.now()}`;
                await redis.zunionstore(tempKey, sourceLeaderboards.length, ...sourceLeaderboards, 'AGGREGATE', 'MAX');
                rank = await getRank(tempKey, userId);
                await redis.del(tempKey);
            } else if (period === 'allTime') {
                rank = await getRank(`Scores_${gameMode}`, userId);
            }

            console.debug('rank', rank);
            return rank;
        } catch (error) {
            console.error('Error getting ranking from Redis:', error);
            throw error;
        }
    }
}

export default ScoreModel;
