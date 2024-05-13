import { query } from 'express-validator';

const adItemName = (field: string) => {
    const validAdItemNames  = ['CoinMode', 'CoinDouble', 'Respawn'];

    return query(field)
        .isString()
        .withMessage(
            `${field} type must be a string.`
        )
        .trim()
        .escape()
        .custom((value: string) => {
            if (!validAdItemNames .includes(value)) {
                throw new Error(`Invalid name of ad items. Allowed values are: ${validAdItemNames .join(', ')}`);
            }
            return true;
        });
};

export { 
    adItemName
};