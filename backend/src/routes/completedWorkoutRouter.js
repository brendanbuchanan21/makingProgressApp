import { Router } from "express";
import { getCompletedWorkouts, logCompletedWorkout } from "../controllers/completedWorkoutController.js";
import { verifyToken } from "../middlewares/authMiddleWare.js";

const completedWorkoutsRouter = Router();


completedWorkoutsRouter.post('/', verifyToken, logCompletedWorkout)

completedWorkoutsRouter.get('/completedWorkouts', verifyToken, getCompletedWorkouts);


export default completedWorkoutsRouter;