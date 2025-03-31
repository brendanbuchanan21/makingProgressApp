import mongoose from "mongoose";

const Schema = mongoose.Schema;

const noPlanSet = new Schema({
    setNumber: {
        type: Number,
        required: false
    },
    id: {
        type: String,
        required: false
    },
    reps: {
        type: Number,
        required: false
    },
    weight: { 
        type: Number,
        required: false
    },
    rir: {
        type: Number,
        required: false
    }
});

const noPlanExercise = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    muscleGroup: {
        type: String,
        required: true
    },
    isComplete: {
        type: Boolean,
        required: true
    },
    sets: [noPlanSet]
});

const noPlanWorkout = new Schema({
    userId: {
        type: String,
        required: true
    },
    dateDone: {
        type: String,
        required: true
    },
    exercises: [noPlanExercise]
}, { timestamps: true});

const noPlanWorkoutModel = mongoose.model('noPlanWorkout', noPlanWorkout);

export default noPlanWorkoutModel;
