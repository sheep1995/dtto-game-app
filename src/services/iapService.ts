import iap from 'in-app-purchase';
import pool from '../database';

export const setupIAP = async (platform: string) => {
    const config: any = {
        test: false,
        verbose: false
    };

    if (platform === 'android') {
        config.googleServiceAccount = {
            privateKey: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: process.env.GOOGLE_CLIENT_EMAIL
        };
    } else if (platform === 'ios') {
        config.appleExcludeOldTransactions = true;
        config.applePassword = process.env.APPLE_SHARED_SECRET;
    }

    iap.config(config);
    await iap.setup();
};

export const getReceipt = (platform: string, packageName: string, commodityId: string, purchaseToken: string) => {
    if (platform === 'android') {
        return {
            packageName,
            productId: 'com.wistronent.game.star.coins.600',//commodityId,
            purchaseToken,
            subscription: false
        };
    } else if (platform === 'ios') {
        return purchaseToken;
    }
};

export const validateReceipt = async (platform: string, receipt: any, commodityId: string) => {
    console.log('platform', platform)
    const validationResponse = await iap.validate(receipt);
    console.log('validationResponse', JSON.stringify(validationResponse));

    let errorMessage: string | undefined, orderId: string | undefined;
    if (platform === 'android') {
        if (validationResponse.productId !== commodityId) {
            errorMessage = "商品id不相符";
        }

        if (validationResponse.consumptionState !== 1) {
            errorMessage = "購買失敗, consumptionState不為1";
        }

        orderId = validationResponse.orderId;
        const orderIdIsExist = await getThePurchase(orderId);
        if (orderIdIsExist) {
            errorMessage = "orderId 已經存在";
        }
    } else {
        if (!validationResponse.latest_receipt) {
            errorMessage = "收據格式不正確";
        }

        if (validationResponse.receipt.in_app[0].product_id !== commodityId) {
            errorMessage = "商品id不相符";
        }

        if (validationResponse.sandbox && process.env.ENVIRONMENT === 'prod') {
            errorMessage = "prod環境不支援sandbox";
        }

        if (validationResponse.status !== 0) {
            errorMessage = "status不為0";
        }

        orderId = validationResponse.receipt.in_app[0].transaction_id;
        const orderIdIsExist = await getThePurchase(orderId);
        console.debug('orderIdIsExist', orderIdIsExist);
        if (orderIdIsExist) {
            errorMessage = "orderId 已經存在";
        }
    }

    return { errorMessage, orderId };
};

export const getThePurchase = async (orderId: string) => {
    const query = `SELECT COUNT(*) AS count FROM Purchases WHERE transactionId = ?`;
    const [rows] = await pool.query(query, [orderId]);
    return rows[0].count > 0;
};