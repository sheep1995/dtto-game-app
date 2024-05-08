import { body } from 'express-validator';

//UID VALIDATOR FUNCTION
const uId = (field: any) => {
    return body(field)
        .isString()
        .withMessage(
            `${field} type must be a string.`
        )
        .trim()
        .escape()
        .isLength({ min: 8 })
        .withMessage(
            `should not be empty and at a minimum eight characters.`
        )
};

//LOGIN TYPE VALIDATOR FUNCTION
const loginType = (field: any) => {
    return body(field)
        .trim()
        .isInt()
        .withMessage(
            `${field} type must be an integer.`
        )
        .bail()
        .custom((value) => {
            if (value < 1 || value > 20) {
                throw new Error('type must be between 1 and 20');
            }
            return true;
        });
};

//EXPORT
export { uId, loginType };