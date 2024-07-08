import { AppDataSource } from '../config/data-source';
import { Repository, EntityManager } from "typeorm";
import { User } from '../entities/User';
import { Session } from '../entities/Session';

export class UserService {
    static async loginUser(userId: string): Promise<void> {
        const sessionRepository = AppDataSource.getRepository(Session);

        // Check for an existing active session
        const activeSession = await sessionRepository.findOne({
            where: { userId, active: true },
            order: { loginTime: 'DESC' }
        });

        if (activeSession) {
            // Update the lastHeartbeat of the existing active session
            activeSession.lastHeartbeat = new Date();
            await sessionRepository.save(activeSession);
        } else {
            // Create a new session
            const session = sessionRepository.create({
                userId,
                loginTime: new Date(),
                lastHeartbeat: new Date(),
                active: true
            });
            await sessionRepository.save(session);
        }
    }

    static async logoutUser(userId: string): Promise<void> {
        const userRepository = AppDataSource.getRepository(User);
        const sessionRepository = AppDataSource.getRepository(Session);

        const user = await userRepository.findOne({ where: { userId } });
        if (!user) throw new Error('User not found');

        const session = await sessionRepository.findOne({ where: { user: { userId }, active: true }, order: { loginTime: 'DESC' } });
        if (session) {
            session.logoutTime = new Date();
            session.active = false;
            await sessionRepository.save(session);
        }
    }

    static async updateHeartbeat(userId: string): Promise<void> {
        const sessionRepository = AppDataSource.getRepository(Session);

        const session = await sessionRepository.findOne({ where: { user: { userId }, active: true }, order: { loginTime: 'DESC' } });
        if (session) {
            session.lastHeartbeat = new Date();
            await sessionRepository.save(session);
        } else {
            throw new Error('Active session not found');
        }
    }

    static async getActivePlayers(startDate: string, endDate: string): Promise<number> {
        const sessionRepository = AppDataSource.getRepository(Session);
        const start = new Date(startDate);
        const end = new Date(endDate);

        const activePlayers = await sessionRepository.createQueryBuilder('session')
            .select('COUNT(DISTINCT session.userId)', 'activePlayers')
            .where('(session.loginTime BETWEEN :start AND :end OR session.logoutTime BETWEEN :start AND :end)', { start, end })
            .getRawOne();

        return activePlayers.activePlayers;
    }

    static async getNextDayRetention(startDate: string, endDate: string): Promise<number> {
        const userRepository = AppDataSource.getRepository(User);
        const sessionRepository = AppDataSource.getRepository(Session);

        const start = new Date(startDate);
        const end = new Date(endDate);
        const nextDayStart = new Date(start.getTime() + 86400000);
        const nextDayEnd = new Date(end.getTime() + 86400000);

        const newPlayers = await userRepository.createQueryBuilder('user')
            .select('user.userId')
            .where('user.createdTime BETWEEN :start AND :end', { start, end })
            .getRawMany();

        const retainedPlayers = await sessionRepository.createQueryBuilder('session')
            .select('session.userId')
            .where('session.loginTime BETWEEN :nextDayStart AND :nextDayEnd', { nextDayStart, nextDayEnd })
            .andWhere('session.userId IN (:...newPlayers)', { newPlayers: newPlayers.map(p => p.userId) })
            .distinct(true)
            .getRawMany();

        return newPlayers.length > 0 ? (retainedPlayers.length / newPlayers.length) * 100 : 0;
    }

    static async getHighestConcurrentUsers(startDate: string, endDate: string): Promise<number> {
        const sessionRepository = AppDataSource.getRepository(Session);
        const start = new Date(startDate);
        const end = new Date(endDate);

        const concurrentUsers = await sessionRepository.createQueryBuilder('session')
            .select('MAX(sessionCount.count)', 'highestConcurrentUsers')
            .from(subQuery => {
                return subQuery
                    .select('COUNT(session.sessionId)', 'count')
                    .from(Session, 'session')
                    .where('session.loginTime <= :end AND (session.logoutTime IS NULL OR session.logoutTime >= :start)', { start, end })
                    .groupBy('session.loginTime, session.logoutTime');
            }, 'sessionCount')
            .getRawOne();

        return concurrentUsers.highestConcurrentUsers;
    }
    
    static async getUserByuuId(uId: string): Promise<User | null> {
        try {
            return await AppDataSource.getRepository(User).findOne({ where: { uId } });
        } catch (error) {
            throw error;
        }
    }

    static async getUserById(userId: string): Promise<User | null> {
        try {
            return await AppDataSource.getRepository(User).findOne({ where: { userId } });
        } catch (error) {
            throw error;
        }
    }

    static async addUser(uId: string, userId: string, token: string, email: string, loginType: string): Promise<User> {
        try {
            const newUser = AppDataSource.getRepository(User).create({ uId, userId, token, email, loginType });
            return await AppDataSource.getRepository(User).save(newUser);
        } catch (error) {
            throw error;
        }
    }

    static async updateUserToken(uId: string, token: string): Promise<void> {
        try {
            await AppDataSource.getRepository(User).update({ uId }, { token });
        } catch (error) {
            throw error;
        }
    }

    static async updateUser(userId: string, updates: Partial<User>): Promise<void> {
        const userRepository = AppDataSource.manager;
        const user = await userRepository.findOne(User, { where: { userId } });
        if (!user) {
            throw new Error('User not found.');
        }

        Object.assign(user, updates); // Update the user with the provided fields
        await userRepository.save(user);
    }

    static async updateUserCoin(userId: string, amount: number, entityManager?: EntityManager): Promise<void> {
        const repo = entityManager ? entityManager.getRepository(User) : AppDataSource.getRepository(User);
        await repo.increment({ userId }, 'coin', amount);
    }

}
