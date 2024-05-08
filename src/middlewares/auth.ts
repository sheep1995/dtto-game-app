import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import UserModel from '../models/UserModel';

// 定义 authenticate 函数的类型声明
type AuthenticateFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// authenticate 函数
const authenticate: AuthenticateFunction = async (req, res, next) => {
    try {
        // Get the token from the request headers
        const token = req.headers.authorization;

        // Check if token exists
        if (!token) {
            res.status(401).json({ error: 'Unauthorized: No token provided' });
            return;
        }

        const { uId, userId, type } = jwt.verify(token, config.JWT_SECRET) as { uId: string, userId: string, type: number };

        const userModel = new UserModel();
        const user = await userModel.getUser(uId);

        // Check if user exists and if the userId and type match the decoded token
        if (!user || user.userId !== userId || user.type !== type) {
            res.status(401).json({ error: 'Unauthorized: Invalid user' });
            return;
        }

        // Attach the decoded user information to the request object for use in subsequent middleware or route handlers

        // Call next to proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.log('Unauthorized:', error);
        if ((error as Error).message === 'jwt expired') {
            res.status(403).json({ error: 'Unauthorized: Token expired' });
        } else {
            res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
    }
};

export default authenticate;
