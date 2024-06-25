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
        .isLength({ min: 5 })
        .withMessage(
            `should not be empty and at a minimum eight characters.`
        )
};

//LOGIN TYPE VALIDATOR FUNCTION
const loginType = (field: any) => {
    return body(field)
        .custom((value: any) => {
            // 檢查值是否為數值類型
            if (typeof value !== 'number') {
                throw new Error(`${field} type must be a number.`);
            }
            // 檢查是否為整數且在指定範圍內
            if (value < 1 || value > 10) {
                throw new Error(`${field} type must between 1 and 10.`);
            }
            return true;
        });
};

//EXPORT
export { uId, loginType };