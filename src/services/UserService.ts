import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { Repository, EntityManager } from "typeorm";

export class UserService {
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
