import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';
import config from '../config';

const userModel = new UserModel();

async function login(req: Request, res: Response): Promise<void> {
    const { uId, loginType }: { uId: string; loginType: number } = req.body;

    try {
        const user = await userModel.getUser(uId);

        if (!user) {
            const userId = generateUserId();
            const token = generateToken(uId, userId, loginType);

            await userModel.addUser(uId, userId, token, loginType);
            res.json({ userId, token });
        } else {
            const { uId, userId, loginType }: { uId: string; userId: string; loginType: number } = user;
            const newToken = generateToken(uId, userId, loginType);

            await userModel.updateUserToken(uId, newToken);
            res.json({ userId, token: newToken });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function refreshToken(req: Request, res: Response): Promise<void> {
    const token: string = req.headers.authorization!;

    try {
        const { uId, userId, loginType } = jwt.verify(token, config.JWT_SECRET) as { uId: string; userId: string; loginType: number };

        const newToken = generateToken(uId, userId, loginType);

        await userModel.updateUserToken(uId, newToken);
        res.json({ userId, token: newToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

function generateUserId(): string {
    return Math.random().toString(36).substring(2, 12); // 10-character random string
}

function generateToken(uId: string, userId: string, loginType: number): string {
    return jwt.sign({ uId, userId, loginType }, config.JWT_SECRET, { expiresIn: '1h' });
}

export default { login, refreshToken };
