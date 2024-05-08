import { Router } from 'express';
import { ExampleController } from '../../controllers/ExampleController';

const router = Router();
const exampleController = new ExampleController();

router.get('/', exampleController.getAllExamples.bind(exampleController));

export default router;
