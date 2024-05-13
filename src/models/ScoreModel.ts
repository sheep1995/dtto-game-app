import { Pool, PoolConnection } from 'mysql2/promise'; // 导入 mysql2/promise 中的 Pool 和 PoolConnection 类型
import pool from '../database'
import Redis from 'ioredis';

const redis = new Redis();

// export interface Score {
//     id?: number; // 分数记录的唯一标识，可选，因为插入时会自动生成
//     player: string; // 玩家名称
//     score: number; // 分数
// }

class ScoreModel {
    private pool: Pool;
    private connection: PoolConnection;

    constructor() {
        this.pool = pool;
    }

    async initConnection() {
        this.connection = await this.pool.getConnection();
    }

    async releaseConnection() {
        if (this.connection) {
            this.connection.release();
        }
    }
    
    async getScoresByGameMode(userId: string, gameMode: string, limit: number) {
        const cacheKey = `user:${userId}:gameMode:${gameMode}:scores`;
        console.debug('cacheKey', cacheKey);

        try {
            const cachedData = await redis.get(cacheKey);
    
            if (cachedData) {
                return JSON.parse(cachedData);
            } else {
                const scores = await this.fetchScoresFromDatabase(userId, gameMode, limit);
                await redis.set(cacheKey, JSON.stringify(scores));
                return scores;
            }
        } catch (error) {
            console.error('Error getting scores from Redis:', error);
            throw error;
        }

    }

    async fetchScoresFromDatabase(userId: string, gameMode: string, limit: number) {
        await this.initConnection();

        try {
            const sql = `SELECT * FROM Scores_${gameMode} WHERE userId = ? ORDER BY score DESC LIMIT ?`
            const [rows] = await this.connection.query(sql, [userId, limit]);
            return rows;
        } catch (error) {
            throw error;
        } finally {
            await this.releaseConnection();
        }
    }

    async getTop100(gameMode: string) {
        await this.initConnection();

        try {
            const sql = `SELECT * FROM Scores_${gameMode} ORDER BY score DESC LIMIT 100`
            const [rows] = await this.connection.query(sql);
            return rows;
        } catch (error) {
            throw error;
        } finally {
            await this.releaseConnection();
        }
    }

    async addScore(userId: string, score: number, playTimeMs: number, gameMode: string) {
        await this.initConnection();
    
        try {
            const sql = `INSERT INTO Scores_${gameMode} (userId, score, playTimeMs) VALUES (?, ?, ?)`;
            await this.connection.query(sql, [userId, score, playTimeMs]);
        } catch (error) {
            throw error;
        } finally {
            await this.releaseConnection();
        }
    }


}

export default ScoreModel;
