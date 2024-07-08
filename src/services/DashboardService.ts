import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { Session } from '../entities/Session';
import { Transaction } from '../entities/Transaction';
import { DailyMetrics } from '../entities/DailyMetrics';

export class DashboardService {
    static async getDashboardMetrics(startDate: string, endDate: string): Promise<any> {
        const sessionRepository = AppDataSource.getRepository(Session);
        const userRepository = AppDataSource.getRepository(User);
        const transactionRepository = AppDataSource.getRepository(Transaction);
        const dailyMetricsRepository = AppDataSource.getRepository(DailyMetrics);

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Active Players
        const activePlayers = await sessionRepository.createQueryBuilder('session')
            .select('COUNT(DISTINCT session.userId)', 'activePlayers')
            .where('(session.loginTime BETWEEN :start AND :end OR session.logoutTime BETWEEN :start AND :end)', { start, end })
            .getRawOne();

        // Calculate Next Day Retention Rate
        const newPlayers = await userRepository.createQueryBuilder('user')
            .select(['user.userId', 'user.createdTime'])
            .where('user.createdTime BETWEEN :start AND :end', { start, end })
            .getRawMany();

        const totalNewPlayers = newPlayers.length;
        console.debug('newPlayers', newPlayers)

        let totalRetainedPlayers = 0;
        for (const newPlayer of newPlayers) {
            const nextDayStart = new Date(newPlayer.user_createdTime);
            nextDayStart.setDate(nextDayStart.getDate() + 1);
            const nextDayEnd = new Date(nextDayStart);
            nextDayEnd.setDate(nextDayEnd.getDate() + 1);

            console.debug('nextDayStart', nextDayStart)
            console.debug('nextDayEnd', nextDayEnd)

            const retainedPlayer = await sessionRepository.createQueryBuilder('session')
                .select('session.userId')
                .where('session.loginTime BETWEEN :nextDayStart AND :nextDayEnd', { nextDayStart, nextDayEnd })
                .andWhere('session.userId = :userId', { userId: newPlayer.user_userId })
                .getOne();

            console.debug('retainedPlayer', retainedPlayer)
            if (retainedPlayer) {
                totalRetainedPlayers += 1;
            }
        }

        const nextDayRetentionRate = totalNewPlayers > 0 ? (totalRetainedPlayers / totalNewPlayers) * 100 : 0;

        // Highest Concurrent Users
        const highestConcurrentUsers = await dailyMetricsRepository.createQueryBuilder('dailyMetrics')
            .select('MAX(dailyMetrics.highestConcurrentUsers)', 'highestConcurrentUsers')
            .where('dailyMetrics.date BETWEEN :start AND :end', { start, end })
            .getRawOne();

        // Cumulative Revenue
        const cumulativeRevenue = await transactionRepository.createQueryBuilder('transaction')
            .select('SUM(transaction.price)', 'cumulativeRevenue')
            .where('transaction.createdTime BETWEEN :start AND :end', { start, end })
            .getRawOne();

        // Payment Rate
        const uniqueLogins = await sessionRepository.createQueryBuilder('session')
            .select('COUNT(DISTINCT session.userId)', 'uniqueLogins')
            .where('session.loginTime BETWEEN :start AND :end', { start, end })
            .getRawOne();

        const uniquePayers = await transactionRepository.createQueryBuilder('transaction')
            .select('COUNT(DISTINCT transaction.userId)', 'uniquePayers')
            .where('transaction.createdTime BETWEEN :start AND :end', { start, end })
            .getRawOne();

        const paymentRate = uniqueLogins.uniqueLogins > 0 ? (uniquePayers.uniquePayers / uniqueLogins.uniqueLogins) * 100 : 0;

        return {
            activePlayers: activePlayers.activePlayers,
            nextDayRetentionRate,
            highestConcurrentUsers: highestConcurrentUsers.highestConcurrentUsers,
            cumulativeRevenue: cumulativeRevenue.cumulativeRevenue,
            paymentRate
        };
    }

    // static async getDashboardMetrics(startDate: string, endDate: string): Promise<any> {
    //     const sessionRepository = AppDataSource.getRepository(Session);
    //     const userRepository = AppDataSource.getRepository(User);
    //     const transactionRepository = AppDataSource.getRepository(Transaction);
    //     const dailyMetricsRepository = AppDataSource.getRepository(DailyMetrics);

    //     const start = new Date(startDate);
    //     const end = new Date(endDate);
    //     const result = [];

    //     for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    //         const dayStart = new Date(date);
    //         const dayEnd = new Date(date);
    //         dayEnd.setDate(dayEnd.getDate() + 1);

    //         // Active Players
    //         const activePlayers = await sessionRepository.createQueryBuilder('session')
    //             .select('COUNT(DISTINCT session.userId)', 'activePlayers')
    //             .where('(session.loginTime BETWEEN :dayStart AND :dayEnd OR session.logoutTime BETWEEN :dayStart AND :dayEnd)', { dayStart, dayEnd })
    //             .getRawOne();

    //         // Next Day Retention Rate
    //         const newPlayers = await userRepository.createQueryBuilder('user')
    //             .select('user.userId', 'userId')
    //             .where('user.createdTime BETWEEN :dayStart AND :dayEnd', { dayStart, dayEnd })
    //             .getRawMany();

    //         let nextDayRetentionRate = 0;
    //         if (newPlayers.length > 0) {
    //             const nextDayStart = new Date(dayStart.getTime() + 86400000);
    //             const nextDayEnd = new Date(dayEnd.getTime() + 86400000);

    //             console.debug('nextDayStart', nextDayStart);
    //             console.debug('nextDayEnd', nextDayEnd);
    //             const retainedPlayers = await sessionRepository.createQueryBuilder('session')
    //                 .select('session.userId')
    //                 .where('session.loginTime BETWEEN :nextDayStart AND :nextDayEnd', { nextDayStart, nextDayEnd })
    //                 .andWhere('session.userId IN (:...newPlayers)', { newPlayers: newPlayers.map(p => p.userId) })
    //                 .distinct(true)
    //                 .getRawMany();


    //             console.debug('newPlayers', newPlayers);
    //             console.debug('retainedPlayers', retainedPlayers);
    //             nextDayRetentionRate = (retainedPlayers.length / newPlayers.length) * 100;
    //         }

    //         // Highest Concurrent Users
    //         const dailyMetrics = await dailyMetricsRepository.findOne({ where: { date: dayStart.toISOString().split('T')[0] } });

    //         // Cumulative Revenue
    //         const cumulativeRevenue = await transactionRepository.createQueryBuilder('transaction')
    //             .select('SUM(transaction.price)', 'cumulativeRevenue')
    //             .where('transaction.createdTime BETWEEN :dayStart AND :dayEnd', { dayStart, dayEnd })
    //             .getRawOne();

    //         // Payment Rate
    //         const uniqueLogins = await sessionRepository.createQueryBuilder('session')
    //             .select('COUNT(DISTINCT session.userId)', 'uniqueLogins')
    //             .where('session.loginTime BETWEEN :dayStart AND :dayEnd', { dayStart, dayEnd })
    //             .getRawOne();

    //         const uniquePayers = await transactionRepository.createQueryBuilder('transaction')
    //             .select('COUNT(DISTINCT transaction.userId)', 'uniquePayers')
    //             .where('transaction.createdTime BETWEEN :dayStart AND :dayEnd', { dayStart, dayEnd })
    //             .getRawOne();

    //         const paymentRate = uniqueLogins.uniqueLogins > 0 ? (uniquePayers.uniquePayers / uniqueLogins.uniqueLogins) * 100 : 0;

    //         result.push({
    //             date: dayStart.toISOString().split('T')[0],
    //             activePlayers: activePlayers.activePlayers,
    //             nextDayRetentionRate,
    //             highestConcurrentUsers: dailyMetrics?.highestConcurrentUsers || 0,
    //             cumulativeRevenue: cumulativeRevenue.cumulativeRevenue,
    //             paymentRate
    //         });
    //     }

    //     return result;
    // }

    static async getHourlyUserLogins(date: Date) {
        const sessionRepository = AppDataSource.getRepository(Session);

        const start = new Date(date.getTime() - 24 * 60 * 60 * 1000);
        const end = date;

        return await sessionRepository.createQueryBuilder('session')
            .select('HOUR(session.loginTime) as hour, COUNT(DISTINCT session.userId) as uniqueLogins')
            .where('session.loginTime BETWEEN :start AND :end', { start, end })
            .groupBy('hour')
            .orderBy('hour')
            .getRawMany();
    }

    static async getHourlyRevenue(date: Date) {
        const transactionRepository = AppDataSource.getRepository(Transaction);

        const start = new Date(date.getTime() - 24 * 60 * 60 * 1000);
        const end = date;

        return await transactionRepository.createQueryBuilder('transaction')
            .select('HOUR(transaction.createdTime) as hour, SUM(transaction.price) as cumulativeRevenue')
            .where('transaction.createdTime BETWEEN :start AND :end', { start, end })
            .groupBy('hour')
            .orderBy('hour')
            .getRawMany();
    }

    static async getSalesStatistics(startDate: string, endDate: string): Promise<any> {
        const transactionRepository = AppDataSource.getRepository(Transaction);

        const start = new Date(startDate);
        const end = new Date(endDate);

        const salesStats = await transactionRepository.createQueryBuilder('transaction')
            .select('transaction.itemId, COUNT(DISTINCT transaction.userId) AS uniqueBuyers, COUNT(transaction.transactionId) AS purchaseCount, SUM(transaction.price) AS totalSales')
            .where('transaction.createdTime BETWEEN :start AND :end', { start, end })
            .groupBy('transaction.itemId')
            .getRawMany();

        return salesStats;
    }
}