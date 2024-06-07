import pool from '../database';

// 記錄購買錯誤
export const logPurchaseError = async (userId: string, now: string, commodityId: string, error: string) => {
    const query = `INSERT INTO purchases (userId, create_time, commodity_id, status, error) VALUES (?, ?, ?, 'fail', ?)`;
    await pool.query(query, [userId, now, commodityId, error]);
};

// 執行交易
export const executeTransaction = async (transactionDetails: any) => {
    const { userId, now, commodityId, totalGameCoin, price, purchaseToken, orderId } = transactionDetails;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 插入訂單
        const orderQuery = `
            INSERT INTO Purchases (transactionId, userId, commodityId, quantity, price, status, createdTime, updatedTime)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await connection.query(orderQuery, [orderId, userId, commodityId, totalGameCoin, price, 'completed', now, now]);

        // 更新用戶物品
        const userItemsQuery = `
            INSERT INTO UserItems (userId, itemId, quantity, updateTime)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                quantity = quantity + VALUES(quantity),
                updateTime = VALUES(updateTime)
        `;
        await connection.query(userItemsQuery, [userId, 'gameCoin', totalGameCoin, now]);

        await connection.commit();
        console.log("Transaction successful.");
    } catch (err) {
        await connection.rollback();
        console.error("Error executing transaction:", err);
        throw err;
    } finally {
        connection.release();
    }
};
