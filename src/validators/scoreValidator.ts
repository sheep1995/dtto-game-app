import { body } from 'express-validator';

const gameMode = (field: string) => {
    const validGameModes = ['Normal', 'LimitedTime', '2000'];

    return body(field)
        .isString()
        .withMessage(
            `${field} type must be a string.`
        )
        .trim()
        .escape()
        .custom((value: string) => {
            if (!validGameModes.includes(value)) {
                throw new Error(`Invalid gameMode. Allowed values are: ${validGameModes.join(', ')}`);
            }
            return true;
        });
};

const score = (field: string) => {
    return body(field)
        .custom((value: number) => {
            if (typeof value !== 'number') {
                throw new Error(`${field} type must be a number.`);
            }

            if (value < 0 || value > 999999) {
                throw new Error(`${field} type must between 0 and 999999.`);
            }
            return true;
        });
};

const playTimeMs = (field: string) => {
    return body(field)
        .custom((value: number) => {
            if (typeof value !== 'number') {
                throw new Error(`${field} type must be a number.`);
            }

            if (value < 0 || value > 86400000) {
                throw new Error(`${field} type must between 0 and 86400000.`);
            }
            return true;
        });
};

export { 
    gameMode,
    score,
    playTimeMs
};