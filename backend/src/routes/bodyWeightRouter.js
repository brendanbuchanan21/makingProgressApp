import { Router } from 'express'
import { newWeightEntry } from '../controllers/bodyWeightController.js';
import { verifyToken } from '../middlewares/authMiddleWare.js';

const bodyWeightRouter = Router();

bodyWeightRouter.post('/', verifyToken, newWeightEntry);

export default bodyWeightRouter;