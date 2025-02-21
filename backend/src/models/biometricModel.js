import mongoose from "mongoose";

const Schema = mongoose.Schema;

const biometricSchema = new Schema({
    height: String,
    weight: Number,
    age: Number,
    Gender: String,
    activityLevel: String,
    goal: String,
    bmi: Number,
    reccomendedCalories: Number,
    bodyFatPercentage: Number,
    leanBodyMass: Number,
});

const biometricModel = mongoose.model('BioMetric', biometricSchema);
export default biometricModel;