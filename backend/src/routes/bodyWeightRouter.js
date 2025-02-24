import { Router } from 'express'
import { newWeightEntry } from '../controllers/bodyWeightController.js';

const bodyWeightRouter = Router();

bodyWeightRouter.post('/', newWeightEntry);

export default bodyWeightRouter;