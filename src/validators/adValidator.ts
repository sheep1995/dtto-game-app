import { query } from 'express-validator';

const type = (field: string) => {
    const validTypes  = ['CoinMode', 'CoinDouble', 'Respawn'];

    return query(field)
        .isString()
        .withMessage(
            `${field} type must be a string.`
        )
        .trim()
        .escape()
        .custom((value: string) => {
            if (!validTypes .includes(value)) {
                throw new Error(`Invalid name of ad items. Allowed values are: ${validTypes .join(', ')}`);
            }
            return true;
        });
};

export { 
    type
};