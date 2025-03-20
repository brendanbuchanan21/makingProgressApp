import mongoose from "mongoose";

const Schema = mongoose.Schema;

    const completedSetSchema = new Schema({
        setNumber: { type: Number, required: true },
        reps: { type: Number, required: true },
        weight: { type: Number, required: true },
        volume: { type: Number, required: true },
        rir: { type: Number, required: true }
    });

    const completedExerciseSchema = new Schema({
        _id: { type: String, required: true },
        name: { type: String, required: true },
        muscleGroup: { type: String, required: true },
        muscleGroupVolume: { type: Number, required: true},
        sets: [completedSetSchema]
    })


    const completedWorkoutSchema = new Schema({
        userId: { type: String, required: true },
        workoutPlanId: { type: String, required: true },
        weekNumber: { type: Number, required: true },
        day: { type: String, required: true },
        date: { type: Date, default: Date.now, required: true },
        totalVolume: { type: Number, required: true },
        exercises: [completedExerciseSchema]

    }, { timestamps: true });

  

  const completedWorkoutModel = mongoose.model("CompletedWorkoutModel", completedWorkoutSchema);
  export default completedWorkoutModel;