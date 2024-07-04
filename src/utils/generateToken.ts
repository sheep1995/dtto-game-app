import jwt from 'jsonwebtoken';
import config from '../config';

export function generateToken(uId: string, userId: string, loginType: string): string {
    return jwt.sign({ uId, userId, loginType }, config.JWT_SECRET, { expiresIn: '1h' });
}