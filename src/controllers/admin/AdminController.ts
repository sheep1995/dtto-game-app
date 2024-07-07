import { Request, Response } from 'express';
import { AdminService } from '../../services/AdminService';

export class AdminController {
    static async register(req: Request, res: Response): Promise<void> {
        const { username, password, email } = req.body;

        try {
            const newAdmin = await AdminService.register(username, password, email);
            res.status(201).json(newAdmin);
        } catch (error) {
            console.error('Registration failed:', error);
            res.status(500).send('Internal server error.');
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        const { username, password } = req.body;

        try {
            const token = await AdminService.login(username, password);
            res.status(200).json({ token });
        } catch (error) {
            console.error('Login failed:', error);
            res.status(400).send(error.message);
        }
    }
}
