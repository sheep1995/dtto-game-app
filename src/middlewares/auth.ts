import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/UserService';

interface User {
    uId: string;
    userId: string;
    loginType: string;
}

type AuthenticateFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const pathsNoRequiringAuth = ['/users/login']; // 不需要 JWT 驗證的 paths
// authenticate 函数
const authenticate: AuthenticateFunction = async (req, res, next) => {
    try {
        // Get the token from the request headers
        const token = req.headers.authorization;
        const noRequiresAuth = pathsNoRequiringAuth.some(path => req.path.startsWith(path));

        if (noRequiresAuth) {
            return next();
        }
        // Check if token exists
        if (!token) {
            res.status(401).json({ error: 'Unauthorized: No token provided' });
            return;
        }

        const { uId, userId, loginType } = jwt.verify(token, process.env.JWT_SECRET) as User;

        const user = await UserService.getUserByuuId(uId);
        console.debug('user', user);
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
