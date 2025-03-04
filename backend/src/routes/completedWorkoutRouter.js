import { Router } from "express";
import { logCompletedWorkout } from "../controllers/completedWorkoutController.js";

const completedWorkoutsRouter = Router();


completedWorkoutsRouter.post('/', logCompletedWorkout)




export default completedWorkoutsRouter;