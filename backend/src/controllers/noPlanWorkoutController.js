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
        const newCompletedWorkout = await noPlanWorkoutModel.create({exercises, dateDone, userId})
        res.status(200).json({message: 'successfully posted new workout'});

    } catch (error) {
        res.status(500).json({error: error.message});
    }

}