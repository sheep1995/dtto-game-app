import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { GameMode2000Score } from '../entities/GameMode2000Score';
import { GameModeLimitedTimeScore } from '../entities/GameModeLimitedTimeScore';
import { GameModeNormalScore } from '../entities/GameModeNormalScore';
import { EntityTarget } from 'typeorm';

interface GameModeConfig {
    entity: EntityTarget<any>;
}

const gameModeMap: Record<string, GameModeConfig> = {
    mode2000: { entity: GameMode2000Score },
    limitedTime: { entity: GameModeLimitedTimeScore },
    normal: { entity: GameModeNormalScore },
    // Add more game modes here
};

export class ScoreService {
    static async recordScore(gameMode: string, userId: string, score: number, playTimeMs: number) {
        const config = gameModeMap[gameMode];

        if (!config) {
            throw new Error('Invalid game mode.');
        }

        const repository = AppDataSource.getRepository(config.entity);

        const scoreRecord = repository.create({ userId, score, playTimeMs });

        await repository.save(scoreRecord);

        return scoreRecord;
    }

    static async getTopScores(gameMode: string, timeFrame: string, userId: string, page: number = 1, limit: number = 100) {
        let repository, orderByField, orderDirection;

        switch (gameMode) {
            case 'mode2000':
                repository = AppDataSource.getRepository(GameMode2000Score);
                orderByField = 'playTimeMs';
                orderDirection = 'ASC';
                break;
            case 'limitedTime':
                repository = AppDataSource.getRepository(GameModeLimitedTimeScore);
                orderByField = 'score';
                orderDirection = 'DESC';
                break;
            case 'normal':
                repository = AppDataSource.getRepository(GameModeNormalScore);
                orderByField = 'score';
                orderDirection = 'DESC';
                break;
            default:
                throw new Error('Invalid game mode.');
        }

        let whereClause;
        switch (timeFrame) {
            case 'today':
                whereClause = `DATE(score.createdTime) = CURDATE()`;
                break;
            case 'week':
                whereClause = `YEARWEEK(score.createdTime, 1) = YEARWEEK(CURDATE(), 1)`;
                break;
            case 'all-time':
                whereClause = `1=1`;  // No additional where clause for all-time ranking
                break;
            default:
                throw new Error('Invalid time frame.');
        }

        console.debug('Querying top scores with:', { whereClause, orderByField, orderDirection, page, limit });

        const queryBuilder = repository.createQueryBuilder('score')
            .leftJoinAndSelect('score.user', 'user')
            .where(whereClause)
            .orderBy(`score.${orderByField}`, orderDirection)
            .skip((page - 1) * limit)
            .take(limit);

        console.debug('Generated SQL Query:', queryBuilder.getSql());
        
        const [topScores, totalCount] = await queryBuilder.getManyAndCount();
        
        console.debug('Top Scores:', topScores);
        console.debug('Total Count:', totalCount);

        const userRankQuery = repository.createQueryBuilder('score')
            .where(whereClause)
            .orderBy(`score.${orderByField}`, orderDirection);

        const userRank = await userRankQuery.getMany();
        console.debug('User Rank Data:', userRank);

        const userRankIndex = userRank.findIndex(score => score.userId === userId) + 1;

        return {
            topUsers: topScores.map(score => ({
                userId: score.user?.userId,
                userName: score.user?.username,
                avatar: score.user?.avatar,
                score: score.score,
                playTimeMs: score.playTimeMs
            })),
            userRank: userRankIndex,
            totalCount
        };
    }
}
