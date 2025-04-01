import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleWare.js";
import { newNonPlanWorkout } from "../controllers/noPlanWorkoutController.js";


const noPlanWorkoutRouter = Router();

noPlanWorkoutRouter.post('/', verifyToken, newNonPlanWorkout);




export default noPlanWorkoutRouter;