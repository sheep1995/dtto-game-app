import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';

export class UserService {
    static async getUserById(userId: string): Promise<User | undefined> {
        return AppDataSource.manager.findOne(User, { where: { userId } });
    }

    static async updateUserCoin(userId: string, amount: number): Promise<void> {
        await AppDataSource.manager.increment(User, { userId }, 'coin', amount);
    }
}
