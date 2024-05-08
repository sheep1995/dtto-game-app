import mysql from 'mysql2/promise';

// 创建数据库连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'sammy',
    password: 'sammy123',
    database: 'mydatabase'
});

export default pool;