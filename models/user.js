class UserModel {
    constructor() {
        this.pool = require('../database'); // 将 pool 设置为实例属性
    }

    async getUser(uId) {
        const connection = await this.pool.getConnection();
        try {
            const [rows, fields] = await connection.execute('SELECT * FROM users WHERE uId = ?', [uId]);
            return rows[0];
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async getUsersList() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM users');
            return rows;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    };

    async getUserById(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
            return rows.length ? rows[0] : null;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async addUser(uId, userId, token, type) {
        const connection = await this.pool.getConnection();
        try {
            await connection.execute('INSERT INTO users (uId, userId, token, type) VALUES (?, ?, ?, ?)', [uId, userId, token, type]);
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async updateUserToken(uId, token) {
        const connection = await this.pool.getConnection();
        try {
            await connection.execute('UPDATE users SET token = ? WHERE uId = ?', [token, uId]);
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = UserModel;