import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/UserService';
import config from '../config';
import { generateUserId } from '../utils/generateUserId';
import { generateToken } from '../utils/generateToken';

export class UserController {
    static async login(req: Request, res: Response): Promise<void> {
        const { uId, loginType, email } = req.body;
    
        try {
            const user = await UserService.getUserByuuId(uId);
    
            if (!user) {
                const userId = generateUserId();
                const token = generateToken(uId, userId, loginType);
    
                await UserService.addUser(uId, userId, token, email, loginType);
                res.json({ userId, token });
            } else {
                const { uId, userId, loginType } = user;
                const newToken = generateToken(uId, userId, loginType);
    
                await UserService.updateUserToken(uId, newToken);
                res.json({ userId, token: newToken });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async refreshToken(req: Request, res: Response): Promise<void> {
        const token: string = req.headers.authorization!;
    
        try {
            const { uId, userId, loginType } = jwt.verify(token, config.JWT_SECRET) as { uId: string; userId: string; loginType: string };
    
            const newToken = generateToken(uId, userId, loginType);
    
            await UserService.updateUserToken(uId, newToken);
            res.json({ userId, token: newToken });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async updateUser(req: Request, res: Response): Promise<void> {
        const { userId } = req.user;
        const updates = req.body;

        try {
            await UserService.updateUser(userId, updates);
            res.send('User updated successfully.');
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).send('Internal server error.');
        }
    }

}