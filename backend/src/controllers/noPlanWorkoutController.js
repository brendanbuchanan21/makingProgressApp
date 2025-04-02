import noPlanWorkoutModel from "../models/noPlanWorkoutModel.js";
import mongoose from "mongoose";



// for posting a completed quick workout 

export const newNonPlanWorkout = async (req, res) => {
    

    try {

        const { exercises, dateDone } = req.body;
        const userId = req.user.uid;
        console.log(userId, 'ok?');

        if (!exercises || !dateDone || !userId) {
            return res.status(400).json({ error: "Missing required fields." });
        }


        const exercisesWithVolume = exercises.map(exercise => {
            const muscleGroupVolume = exercise.sets.reduce((acc, set) => acc + (set.weight * set.reps), 0);
            return { ...exercise, muscleGroupVolume };
        })

        
        const totalWorkoutVolume = exercisesWithVolume.reduce((acc, exercise) => acc + exercise.muscleGroupVolume, 0);
        const newCompletedWorkout = await noPlanWorkoutModel.create({exercises: exercisesWithVolume, dateDone, userId, totalVolume: totalWorkoutVolume});
        
        res.status(200).json({message: 'successfully posted new workout'});

    } catch (error) {
        res.status(500).json({error: error.message});
    }

}

export const getAllNonPlanWorkouts = async (req, res) => {

    try {
        const userId = req.user.uid;

        if(!userId) {
           return res.status(400).json({message: 'could not find user id?'});
        }

        const completedWorkouts = await noPlanWorkoutModel.find({ userId });
        
        res.status(200).json(completedWorkouts);
    } catch (error) {
        console.error('error fetching non-plan workouts:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}