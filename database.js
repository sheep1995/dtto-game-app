const mysql = require('mysql2/promise');

// fixme
const pool = mysql.createPool({
    host: 'localhost',
    user: 'sammy',
    password: 'sammy123',
    database: 'mydatabase'
});

module.exports = pool;