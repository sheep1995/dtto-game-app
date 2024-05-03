const pool = require('../database');

// Methods to interact with the data
const getUsersList = async () => {
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

const getUserById = async (id) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows.length ? rows[0] : null;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
};

const addUser = async (newUser) => {
    const connection = await pool.getConnection();
    try {
        await connection.query('INSERT INTO users SET ?', [newUser]);
        return newUser;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
};

// Export model methods
module.exports = {
    getUsersList,
    getUserById,
    addUser
};