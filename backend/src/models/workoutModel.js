import mongoose from "mongoose";

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    muscleGroup: {
        type: String,
        required: true
    },
    sets: {
        type: Number,
        required: true
    }, 
    repsInReserve: {
        type: Number,
        required: true
    },
});

const dayPlanSchema = new Schema({
    day: {
        type: String,
        required: true
    },
    exercises: [exerciseSchema],
})

const weekPlanSchema = new Schema({
    weekNumber: {
        type: Number, 
        required: true
    },
    days: [dayPlanSchema]
})

const workoutSchema = new Schema({

    name: {
        type: String,
        required: true,
    },
    weeks: [weekPlanSchema],
    duration: {
        type: String,
        required: true
    }
}, { timestamps: true});

const workoutModel = mongoose.model('Workout', workoutSchema);

export default workoutModel;