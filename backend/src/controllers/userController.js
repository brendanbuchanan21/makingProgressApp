import mongoose from "mongoose";
import completedProgramModel from '../models/completedProgramsModel.js'
import completedWorkoutModel from "../models/completedWorkoutsModel.js";
import noPlanWorkoutModel from '../models/noPlanWorkoutModel.js'
import workoutModel from "../models/workoutModel.js";

export const resetAccount = async (req, res) => {

    try {

        const userId = req.user.uid;
        await completedProgramModel.deleteMany({userId: userId});
        await completedWorkoutModel.deleteMany({userId: userId});
        await noPlanWorkoutModel.deleteMany({userId: userId});
        await workoutModel.deleteMany({userId: userId});

        res.status(200).json({message: 'Account reset successfully'});

    } catch (error) {
        console.error('error resestting account:', error);
        res.status(500).json({message: 'error resetting account'});
    }
}