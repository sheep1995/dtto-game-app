import { Pool, PoolConnection } from 'mysql2/promise'; // 导入 mysql2/promise 中的 Pool 和 PoolConnection 类型
import pool from '../database'

class UserModel {
    private pool: Pool; // 将 pool 属性声明为私有属性

    constructor() {
        this.pool = pool; // 将 pool 设置为实例属性
    }

    async query(sql: string, values?: any[]): Promise<any> {
        const connection: PoolConnection = await this.pool.getConnection();
        try {
            const [rows, fields] = await connection.execute(sql, values);
            return rows;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async getUser(uId: string): Promise<any | null> {
        try {
            const sql = 'SELECT * FROM users WHERE uId = ?';
            const [rows] = await this.query(sql, [uId]);
            console.log('rows', rows);
            return rows ?? null;
        } catch (error) {
            throw error;
        }
    }

    async getUsersList() {
        const connection: PoolConnection = await this.pool.getConnection(); // 指定 connection 变量的类型为 PoolConnection
        try {
            const [rows] = await connection.query('SELECT * FROM users');
            return rows;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    };

    // async getUserById(id: string) {
    //     const connection: PoolConnection = await this.pool.getConnection(); // 指定 connection 变量的类型为 PoolConnection
    //     try {
    //         const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
    //         return rows.length ? rows[0] : null;
    //     } catch (error) {
    //         throw error;
    //     } finally {
    //         connection.release();
    //     }
    // }

    async addUser(uId: string, userId: string, token: string, type: number) {
        const connection: PoolConnection = await this.pool.getConnection(); // 指定 connection 变量的类型为 PoolConnection
        try {
            await connection.execute('INSERT INTO users (uId, userId, token, type) VALUES (?, ?, ?, ?)', [uId, userId, token, type]);
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async updateUserToken(uId: string, token: string) {
        const connection: PoolConnection = await this.pool.getConnection(); // 指定 connection 变量的类型为 PoolConnection
        try {
            await connection.execute('UPDATE users SET token = ? WHERE uId = ?', [token, uId]);
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default UserModel;
