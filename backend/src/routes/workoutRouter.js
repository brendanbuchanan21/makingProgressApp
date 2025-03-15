import { Router } from "express";
import workoutModel from "../models/workoutModel.js";
import { newWorkoutPlan, addExerciseToDay, getWorkoutPlan, deleteAnExercise, editExercise, getExerciseFromPlan, deleteEntireProgram, addSetToExercise, deleteSet, updateWorkoutDay, deleteWeekFromPlan, addWeekToPlan, addDuplicatedWeeks} from "../controllers/workoutController.js";
import { verifyToken } from "../middlewares/authMiddleWare.js";

const workoutRouter = Router();



//get workout plan 
workoutRouter.get('/:id', verifyToken, getWorkoutPlan);

workoutRouter.get('/:id/weeks/:weekNumber/days/:day/:exerciseId', verifyToken, getExerciseFromPlan)

//post a single workout
workoutRouter.post('/', verifyToken, newWorkoutPlan);

//delete a single workout
workoutRouter.delete('/:id/weeks/:weekNumber/days/:day/:exerciseId', verifyToken, deleteAnExercise);

//add an individual exercise to an existing plan
workoutRouter.post('/:id/weeks/:weekNumber/days/:day', verifyToken, addExerciseToDay)
//delete a workout

workoutRouter.patch('/:workoutId/weeks/:weekNumber/days/:day/:exerciseId', verifyToken, editExercise)


workoutRouter.delete('/:id', verifyToken, deleteEntireProgram);

workoutRouter.post('/:workoutId/weeks/:weekNumber/days/:day/:exerciseId/sets', verifyToken, addSetToExercise)

workoutRouter.delete('/:workoutId/weeks/:weekNumber/days/:day/:exerciseId/sets/:setId', verifyToken, deleteSet)

workoutRouter.patch('/:workoutPlanId/weeks/:weekNumber/days/:day', verifyToken, updateWorkoutDay),

workoutRouter.delete('/:workoutPlanId/weeks/:weekNumber', verifyToken, deleteWeekFromPlan);

workoutRouter.patch('/:workoutPlanId/weeks', verifyToken, addWeekToPlan);

workoutRouter.patch('/:id', verifyToken, addDuplicatedWeeks);

export default workoutRouter;

