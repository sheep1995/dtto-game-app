// src/models/AdModel.ts
import Redis from 'ioredis';

const redis = new Redis();

// Mapping table for default ad daily limited counts by adItemName
const defaultCounts: Record<string, number> = {
	item1: 1,
	item2: 2,
	item3: 1,
};

class AdModel {
	async setAdCount(adItemName: string, userId: string, date: string, count: number): Promise<void> {
		const key = `ad_${adItemName}:${userId}:${date}`;
		try {
			await redis.set(key, count.toString(), 'EX', 60 * 60 * 24);
		} catch (error) {
			console.error('Error set count in Redis:', error);
			throw error;
		}

	}

	async getAdCount(adItemName: string, userId: string, date: string): Promise<number> {
		const key = `ad_${adItemName}:${userId}:${date}`;
		try {
			const countStr = await redis.get(key);
			if (countStr === null) {
				return defaultCounts[adItemName] || 0;
			} else {
				return parseInt(countStr, 10);
			}

		} catch (error) {
			console.error('Error querying Redis:', error);
			return 0;
		}
	}

	async decrementAdCount(adItemName: string, userId: string, date: string): Promise<number> {
		const key = `ad_${adItemName}:${userId}:${date}`;
		try {
			const currentCount = await redis.get(key);

			if (currentCount !== null) {
				const count = parseInt(currentCount, 10);

				// 檢查剩餘次數是否大於 0，如果是，則進行遞減操作
				if (count > 0) {
					const result = await redis.decr(key);
					return result;
				} else {
					throw new Error('Count is already zero');
				}
			} else {
				// 如果未能獲取到當前次數，則表示今天尚未領取則從預設值開始遞減
				const remainingCount = (defaultCounts[adItemName] || 1) - 1;
				await redis.set(key, remainingCount.toString(), 'EX', 60 * 60 * 24);
				return remainingCount;
			}
		} catch (error) {
			console.error('Error decrementing count in Redis:', error);
			throw error;
		}
	}
}

export default AdModel;
