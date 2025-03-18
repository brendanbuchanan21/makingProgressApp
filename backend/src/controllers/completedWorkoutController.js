import completedWorkoutModel from "../models/completedWorkoutsModel.js";

import mongoose from "mongoose";

export const logCompletedWorkout = async (req, res) => {
    
    try {
        console.log('Received data:', JSON.stringify(req.body, null, 2));
    const { workoutPlanId, weekNumber, day, exercises } = req.body;
    const userId = req.user?.uid;

    
        if(!workoutPlanId || !weekNumber || !day || !Array.isArray(exercises) || exercises.length === 0 || !userId) {
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
            userId,
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

export const getCompletedWorkouts = async (req, res) => {
        const { workoutPlanId } = req.query;
        const userId = req.user.id;

        console.log('userId??', userId);
        const trimmedId = workoutPlanId.trim();  // Remove any extra whitespace or newlines

        if (!trimmedId) {
            return res.status(400).json({ message: 'Workout plan ID is required' });
        }
        console.log(trimmedId, 'whats this trimmed id??')

        try {
            const completedWorkouts = await completedWorkoutModel.find({ workoutPlanId: trimmedId,
                userId: userId
             });
            console.log('Found completed workouts:', completedWorkouts);
            res.status(200).json(completedWorkouts);
        } catch (error) {
            console.error('Error retrieving completed workouts:', error);
            return res.status(500).json({ message: 'Error retrieving data' });
        }
};