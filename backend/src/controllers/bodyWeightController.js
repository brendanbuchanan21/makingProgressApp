import bodyWeightModel from "../models/bodyWeightModel.js";
import mongoose from "mongoose";

export const newWeightEntry = async (req, res) => {
    const { date, weight } = req.body;

    try {
        const newBodyWeightEntry = await bodyWeightModel.create({ date, weight})
        res.status(200).json({message: "new weight added to the backend:", newBodyWeightEntry})
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}