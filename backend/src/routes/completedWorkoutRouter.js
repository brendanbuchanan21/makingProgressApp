import { Router } from "express";
import { getCompletedWorkouts, logCompletedWorkout } from "../controllers/completedWorkoutController.js";

const completedWorkoutsRouter = Router();


completedWorkoutsRouter.post('/', logCompletedWorkout)

completedWorkoutsRouter.get('/completedWorkouts', getCompletedWorkouts);


export default completedWorkoutsRouter;