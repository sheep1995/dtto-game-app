import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import UserModel from '../models/UserModel';
import User from '../models/User';
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

        const { uId, userId, loginType } = jwt.verify(token, config.JWT_SECRET) as User;

        const userModel = new UserModel();
        const user = await userModel.getUser(uId);

        // Check if user exists and if the userId and loginType match the decoded token
        if (!user || user.userId !== userId || user.loginType !== loginType) {
            res.status(401).json({ error: 'Unauthorized: Invalid user' });
            return;
        }

        req.user = user;

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
