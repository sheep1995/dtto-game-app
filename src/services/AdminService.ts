import { AppDataSource } from '../config/data-source';
import { Admin } from '../entities/Admin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateUserId } from '../utils/generateUserId';

export class AdminService {
    static async register(username: string, password: string, email: string): Promise<Admin> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin();
        admin.username = username;
        admin.password = hashedPassword;
        admin.email = email;

        admin.id = generateUserId();

        const adminRepository = AppDataSource.getRepository(Admin);
        return adminRepository.save(admin);
    }

    static async getStaffById(id: string): Promise<Admin | null> {
        const staffRepository = AppDataSource.getRepository(Admin);
        const staff = await staffRepository.findOne({ where: { id } });
        return staff;
    }

    static async login(username: string, password: string): Promise<string | null> {
        const adminRepository = AppDataSource.getRepository(Admin);
        const admin = await adminRepository.findOne({ where: { username } });

        if (!admin) {
            throw new Error('Admin not found');
        }

        const validPassword = await bcrypt.compare(password, admin.password);

        if (!validPassword) {
            throw new Error('Invalid password');
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        return token;
    }
}
