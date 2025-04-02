import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleWare.js";
import { getAllNonPlanWorkouts, newNonPlanWorkout } from "../controllers/noPlanWorkoutController.js";


const noPlanWorkoutRouter = Router();

noPlanWorkoutRouter.post('/', verifyToken, newNonPlanWorkout);
noPlanWorkoutRouter.get('/', verifyToken, getAllNonPlanWorkouts);



export default noPlanWorkoutRouter;