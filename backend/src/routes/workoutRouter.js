import { Router } from "express";
import workoutModel from "../models/workoutModel.js";
import { newWorkoutPlan, addExerciseToDay, getWorkoutPlan, deleteAnExercise, editExercise, getExerciseFromPlan, deleteEntireProgram, addSetToExercise, deleteSet, updateWorkoutDay } from "../controllers/workoutController.js";

const workoutRouter = Router();



//get workout plan 
workoutRouter.get('/:id', getWorkoutPlan);

workoutRouter.get('/:id/weeks/:weekNumber/days/:day/:exerciseId', getExerciseFromPlan)

//post a single workout
workoutRouter.post('/', newWorkoutPlan);

//delete a single workout
workoutRouter.delete('/:id/weeks/:weekNumber/days/:day/:exerciseId', deleteAnExercise);

//add an individual exercise to an existing plan
workoutRouter.post('/:id/weeks/:weekNumber/days/:day', addExerciseToDay)
//delete a workout

workoutRouter.patch('/:workoutId/weeks/:weekNumber/days/:day/:exerciseId', editExercise)


workoutRouter.delete('/:id', deleteEntireProgram);

workoutRouter.post('/:workoutId/weeks/:weekNumber/days/:day/:exerciseId/sets', addSetToExercise)

workoutRouter.delete('/:workoutId/weeks/:weekNumber/days/:day/:exerciseId/sets/:setId', deleteSet)

workoutRouter.patch('/:workoutId/weeks/:weekNumber/days/:day', updateWorkoutDay)

export default workoutRouter;

