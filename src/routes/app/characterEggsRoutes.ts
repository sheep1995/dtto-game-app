import { Router } from 'express';
import { CombineController } from '../../controllers/CombineController';
import authMiddleware from '../../middlewares/auth';
import { validateAddCharacterEgg, validateHatchEgg, validateCombineItems } from '../../validator';

const _router: Router = Router({
  mergeParams: true,
});
const combineController = new CombineController();

/**
 * @swagger
 * /character-eggs/{itemId}/hatch:
 *   post:
 *     summary: Hatch a character egg
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the character egg to hatch
 *     responses:
 *       200:
 *         description: Successfully hatched the character egg
 */
_router.post('/character-eggs/:itemId/hatch', authMiddleware, validateHatchEgg, combineController.hatchEgg);

/**
 * @swagger
 * /character-eggs:
 *   post:
 *     summary: Add character egg quantity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: ID of the character egg
 *               quantity:
 *                 type: integer
 *                 description: Quantity to add
 *     responses:
 *       200:
 *         description: Successfully added character egg quantity
 */
_router.post('/character-eggs', authMiddleware, validateAddCharacterEgg, combineController.addCharacterEgg);

/**
 * @swagger
 * /character-eggs:
 *   get:
 *     summary: Get list of character eggs
 *     responses:
 *       200:
 *         description: Successfully retrieved character eggs list
 */
_router.get('/character-eggs', authMiddleware, combineController.getCharacterEggs);

export const router = _router;
