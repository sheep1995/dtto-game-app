import { AppDataSource } from './config/data-source';
import { Session } from './entities/Session';
import { DailyMetrics } from './entities/DailyMetrics';
import { CronJob } from 'cron';

const HEARTBEAT_THRESHOLD = 10 * 60 * 1000; // 10 minutes

const checkInactiveSessions = async () => {
    const sessionRepository = AppDataSource.getRepository(Session);
    const now = new Date();

    try {
        // Find sessions where the last heartbeat is older than the threshold and they are still marked as active
        const inactiveSessions = await sessionRepository.createQueryBuilder('session')
            .where('session.active = :active', { active: true })
            .andWhere('session.lastHeartbeat < :threshold', { threshold: new Date(now.getTime() - HEARTBEAT_THRESHOLD) })
            .getMany();

        for (const session of inactiveSessions) {
            session.active = false;
            session.logoutTime = now;
            await sessionRepository.save(session);
        }

        console.log(`Checked for inactive sessions. Logged out ${inactiveSessions.length} sessions.`);
    } catch (error) {
        console.error('Failed to check inactive sessions:', error);
    }
};

async function updateHighestConcurrentUsers() {
    const sessionRepository = AppDataSource.getRepository(Session);
    const dailyMetricsRepository = AppDataSource.getRepository(DailyMetrics);

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const currentOnlineUsers = await sessionRepository.createQueryBuilder('session')
        .where('session.logoutTime IS NULL OR session.logoutTime > :now', { now })
        .andWhere('session.loginTime <= :now', { now })
        .getCount();

    let dailyMetrics = await dailyMetricsRepository.findOne({ where: { date: today } });

    if (!dailyMetrics) {
        dailyMetrics = new DailyMetrics();
        dailyMetrics.date = today;
        dailyMetrics.highestConcurrentUsers = currentOnlineUsers;
    } else if (currentOnlineUsers > dailyMetrics.highestConcurrentUsers) {
        dailyMetrics.highestConcurrentUsers = currentOnlineUsers;
    }

    await dailyMetricsRepository.save(dailyMetrics);
}

// Schedule the job to run every 5 minutes
const checkInactiveSessionsJob = new CronJob('*/5 * * * *', checkInactiveSessions);
const updateHighestConcurrentUsersJob = new CronJob('*/1 * * * *', updateHighestConcurrentUsers);

checkInactiveSessionsJob.start();
updateHighestConcurrentUsersJob.start();

console.log('Cron job for checking inactive sessions has started.');
