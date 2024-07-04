import { body, checkSchema, CustomValidator } from 'express-validator';

//UID VALIDATOR FUNCTION
const uId = (field: any) => {
    return body(field)
        .isString()
        .withMessage(
            `${field} type must be a string.`
        )
        .trim()
        .escape()
        .isLength({ min: 5 })
        .withMessage(
            `should not be empty and at a minimum eight characters.`
        )
};

//LOGIN TYPE VALIDATOR FUNCTION
const loginTypes = ['facebook', 'dcard', 'google', 'apple'];
const loginType = (field: string) => {
    return body(field)
        .custom((value: any) => {
            // 檢查值是否為字符串類型
            if (typeof value !== 'string') {
                throw new Error(`${field} type must be a string.`);
            }
            // 檢查是否為指定的 ENUM 值之一
            if (!loginTypes.includes(value)) {
                throw new Error(`${field} type must be one of ${loginTypes.join(', ')}.`);
            }
            return true;
        });
};

const validateUserUpdate = checkSchema({
    username: {
        optional: true,
        isString: true,
        isLength: {
            options: { min: 3, max: 255 },
            errorMessage: 'Username must be between 3 and 255 characters.',
        },
    },
    email: {
        optional: true,
        isEmail: true,
        errorMessage: 'Must be a valid email.',
    },
    avatar: {
        optional: true,
        isURL: true,
        errorMessage: 'Must be a valid URL.',
    },
    coin: {
        optional: true,
        isInt: {
            options: { min: 0 },
            errorMessage: 'Coin must be a positive integer.',
        },
        toInt: true,
    },
    characterLevel: {
        optional: true,
        isInt: {
            options: { min: 1 },
            errorMessage: 'Character level must be an integer greater than 0.',
        },
        toInt: true,
    },
});

//EXPORT
export { uId, loginType, validateUserUpdate };