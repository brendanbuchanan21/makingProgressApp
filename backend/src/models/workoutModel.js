import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SetDetails = new Schema({
    setNumber: {
        type: Number,
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


const exerciseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    muscleGroup: {
        type: String,
        required: true
    },
    sets: [SetDetails],
});

const dayPlanSchema = new Schema({
    day: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        required: false
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
    },
    startDate: {
        type: String,
        required: true
    }
}, { timestamps: true});

const workoutModel = mongoose.model('Workout', workoutSchema);

export default workoutModel;