const mysql = require('mysql2/promise');

// 建立 MySQL 連接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'sammy',
    password: 'sammy123',
    database: 'mydatabase'
});

// 添加或更新玩家分數
async function addScores() {
    try {
        const connection = await pool.getConnection();
        const query = `INSERT INTO Scores_Normal (userId, score, playTimeMs, createTime)
        SELECT 
            CONCAT('user', LPAD(FLOOR(1 + RAND() * 999), 3, '0')),
            FLOOR(1 + RAND() * 10000),
            FLOOR(1000 + RAND() * 999000),
            NOW() - INTERVAL FLOOR(1 + RAND() * 30) DAY - INTERVAL FLOOR(1 + RAND() * 24) HOUR - INTERVAL FLOOR(1 + RAND() * 60) MINUTE - INTERVAL FLOOR(1 + RAND() * 60) SECOND
        FROM 
            information_schema.tables t1,
            information_schema.tables t2
        LIMIT 100000;`;
        await connection.query(query);
        console.log('Score added or updated successfully');
        connection.release(); // 释放连接
    } catch (err) {
        console.error('Error adding or updating score:', err);
    }
}

// 查詢玩家排名
async function getPlayerRank(userId) {
    try {
        const connection = await pool.getConnection();
        const query = `SELECT FIND_IN_SET(score, (SELECT GROUP_CONCAT(score ORDER BY score DESC) FROM Scores_Normal)) AS player_rank
                       FROM Scores_Normal WHERE userId = ?`;
        const [rows, fields] = await connection.query(query, [userId]);
        const rank = rows.length > 0 ? rows[0].rank : null;
        connection.release(); // 释放连接
        return rank;
    } catch (err) {
        console.error('Error getting player rank:', err);
        return null;
    }
}

// 查詢排行榜（當日/當周/全部）
async function getLeaderboard(type = 'all') {
    try {
        let query = 'SELECT * FROM Scores_Normal';
        const now = new Date();

        // 根據類型設置查詢條件
        if (type === 'today') {
            const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            query += ` WHERE createTime >= '${startDate.toISOString()}'`;
        } else if (type === 'week') {
            const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
            query += ` WHERE createTime >= '${startDate.toISOString()}'`;
        }

        // 執行查詢
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.query(query);
        connection.release(); // 释放连接
        return rows;
    } catch (err) {
        console.error('Error getting leaderboard:', err);
        return null;
    }
}

// 清空排行榜
async function clearLeaderboard() {
    try {
        const connection = await pool.getConnection();
        const query = 'DELETE FROM Scores_Normal';
        const [rows, fields] = await connection.query(query);
        console.log('Leaderboard cleared successfully');
        connection.release(); // 释放连接
    } catch (err) {
        console.error('Error clearing leaderboard:', err);
    }
}

// 使用範例
async function example() {
    // for (let i = 0; i < 100; i++) {
    //     await addScores();
    // }

    // const player1Rank = await getPlayerRank('user212');
    // console.log('Player 1 rank:', player1Rank);

    // const todayLeaderboard = await getLeaderboard('today');
    //console.log('Today leaderboard:', todayLeaderboard);

    //await clearLeaderboard();

}

example();
