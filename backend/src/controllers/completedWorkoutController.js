import completedWorkoutModel from "../models/completedWorkoutsModel.js";

import mongoose from "mongoose";

export const logCompletedWorkout = async (req, res) => {
    
    try {
        console.log('Received data:', JSON.stringify(req.body, null, 2));
    const { workoutPlanId, weekNumber, day, exercises } = req.body;
        if(!workoutPlanId || !weekNumber || !day || !Array.isArray(exercises) || exercises.length === 0) {
            res.status(404).json({message: 'missing data from workout such as the id or week number'});
            return;
        }

        let totalWorkoutVolume = 0;


        const processedExercises = exercises.map(exercise => {
            let muscleGroupVolume = 0;

            const processedSets = exercise.sets.map(set => {
                const setVolume = set.reps * set.weight;
                muscleGroupVolume += setVolume;
                return { ...set, volume: setVolume };
            })

            totalWorkoutVolume += muscleGroupVolume;

            return {
                ...exercise,
                sets: processedSets,
                muscleGroupVolume
            };
        });

        const workoutComplete = new completedWorkoutModel({
            workoutPlanId,
            weekNumber,
            day,
            exercises: processedExercises,
            totalVolume: totalWorkoutVolume

        })
        // save to database
        await workoutComplete.save();

        res.status(201).json({message: 'successfully logged', workoutComplete});
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}