import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateItemId = param('itemId').notEmpty().withMessage('itemId is required and cannot be null or undefined');
const validateBodyItemId = body('itemId').notEmpty().withMessage('itemId is required and cannot be null or undefined');
const validateQuantity = body('quantity').notEmpty().isInt({ gt: 0 }).withMessage('quantity is required and must be a positive integer');

const createValidator = (fields: any[]) => {
  const validators = [...fields, handleValidationErrors];
  return validators;
};

export const validateAddCharacterEgg = createValidator([
  validateBodyItemId,
  validateQuantity,
]);

export const validateHatchEgg = createValidator([
  validateItemId,
]);

export const validateCombineItems = createValidator([
  body('itemIds').isArray({ min: 1 }).withMessage('itemIds must be a non-empty array'),
]);
