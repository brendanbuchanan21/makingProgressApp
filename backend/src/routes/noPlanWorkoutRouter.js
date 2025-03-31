import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleWare";
import { newNonPlanWorkout } from "../controllers/noPlanWorkoutController";


const noPlanWorkoutRouter = Router();

noPlanWorkoutRouter.post('/', verifyToken, newNonPlanWorkout);




export default noPlanWorkoutRouter;