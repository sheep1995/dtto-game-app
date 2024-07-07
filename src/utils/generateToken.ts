import jwt from 'jsonwebtoken';

export function generateToken(uId: string, userId: string, loginType: string): string {
    return jwt.sign({ uId, userId, loginType }, process.env.JWT_SECRET, { expiresIn: '1h' });
}