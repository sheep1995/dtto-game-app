import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
console.debug('redisHost', redisHost);
const redis = new Redis({
  host: redisHost,
  port: 6379
});

// Mapping table for default ad daily limited counts by type
const defaultCounts: Record<string, number> = {
	CoinMode: 3,
	CoinDouble: 3,
	Respawn: 3,
};

class AdService {
	async setAdCount(type: string, userId: string, date: string, count: number): Promise<number> {
        const key = `ad_${type}:${userId}:${date}`;
        try {
            await redis.set(key, count.toString(), 'EX', 60 * 60 * 24);
            return count; // Return the count after setting it in Redis
        } catch (error) {
            console.error('Error setting count in Redis:', error);
            throw error;
        }
    }

	async getAdCount(type: string, userId: string, date: string): Promise<number> {
		const key = `ad_${type}:${userId}:${date}`;
		try {
			const countStr = await redis.get(key);
			if (countStr === null) {
				return defaultCounts[type] || 0;
			} else {
				return parseInt(countStr, 10);
			}
		} catch (error) {
			console.error('Error querying Redis:', error);
			return 0;
		}
	}

	async decrementAdCount(type: string, userId: string, date: string): Promise<number> {
		const key = `ad_${type}:${userId}:${date}`;
		try {
			const currentCount = await redis.get(key);

			if (currentCount !== null) {
				const count = parseInt(currentCount, 10);

				// Check if remaining count is greater than 0, if so, decrement
				if (count > 0) {
					const result = await redis.decr(key);
					return result;
				} else {
					throw new Error('Count is already zero');
				}
			} else {
				// If no current count is found, start decrementing from the default value
				const remainingCount = (defaultCounts[type] || 1) - 1;
				await redis.set(key, remainingCount.toString(), 'EX', 60 * 60 * 24);
				return remainingCount;
			}
		} catch (error) {
			console.error('Error decrementing count in Redis:', error);
			throw error;
		}
	}
}

export default new AdService();
