import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { EntityManager } from "typeorm";

export class UserService {
    static async getUserById(userId: string): Promise<User | undefined> {
        return AppDataSource.manager.findOne(User, { where: { userId } });
    }

    static async updateUserCoin(userId: string, amount: number, entityManager?: EntityManager): Promise<void> {
        const repo = entityManager ? entityManager.getRepository(User) : AppDataSource.getRepository(User);
        await repo.increment({ userId }, 'coin', amount);
    }
}
