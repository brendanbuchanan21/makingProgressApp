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
        id: { type: String, required: true },
        name: { type: String, required: true },
        muscleGroup: { type: String, required: true },
        muscleGroupVolume: { type: Number, required: true},
        sets: [completedSetSchema]
    })


    const completedWorkoutSchema = new Schema({
        workoutPlanId: { type: String, required: true },
        weekNumber: { type: Number, required: true },
        day: { type: String, required: true },
        date: { type: Date, default: Date.now, required: true },
        totalVolume: { type: Number, required: true },
        exercises: [completedExerciseSchema]

    }, { timestamps: true });

    // Optional: Convert _id to id in JSON output for consistency
completedWorkoutSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  });

  const completedWorkoutModel = mongoose.model("CompletedWorkoutModel", completedWorkoutSchema);
  export default completedWorkoutModel;