import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CompletedProgramSchema = new Schema({
    workoutPlanId: {
        type: String, 
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String, 
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String, 
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    totalVolume: {
        type: Number,
        required: true
    },
    }, { timestamps: true});

    const completedProgramModel = mongoose.model('CompletedProgram', CompletedProgramSchema);

    export default completedProgramModel;
