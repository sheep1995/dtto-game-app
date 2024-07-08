import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/UserService';
import { generateUserId } from '../utils/generateUserId';
import { generateToken } from '../utils/generateToken';

import multer from 'multer';
import MulterGoogleCloudStorage from 'multer-cloud-storage';

const storage = new MulterGoogleCloudStorage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    bucket: 'toptok-8bcfc.appspot.com',
    projectId: 'toptok-8bcfc',
    acl: 'publicRead'  // 设置文件上传后是公开读取的
});

export const upload = multer({ storage });

export class UserController {
    static async login(req: Request, res: Response): Promise<void> {
        const { uId, loginType, email } = req.body;

        try {
            const user = await UserService.getUserByuuId(uId);
            console.debug('user', user);
            if (!user) {
                const userId = generateUserId();
                const token = generateToken(uId, userId, loginType);

                await UserService.addUser(uId, userId, token, email, loginType);
                await UserService.loginUser(userId);
                res.json({ userId, token });
            } else {
                const { uId, userId, loginType } = user;
                const newToken = generateToken(uId, userId, loginType);
                
                await UserService.updateUserToken(uId, newToken);
                await UserService.loginUser(userId);
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
            const { uId, userId, loginType } = jwt.verify(token, process.env.JWT_SECRET) as { uId: string; userId: string; loginType: string };

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

    static uploadAvatar(req: Request, res: Response) {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        res.status(200).json({
            message: 'File uploaded successfully.',
            imageUrl: req.file.cloudStoragePublicUrl
        });
    }

}