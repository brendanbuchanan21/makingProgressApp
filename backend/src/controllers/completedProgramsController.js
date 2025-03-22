import completedProgramModel from "../models/completedProgramsModel.js";
import completedWorkoutModel from "../models/completedWorkoutsModel.js";

export const postCompletedProgram = async (req, res) => {

    try {
        const { workoutPlanId, name, startDate, duration } = req.body;
        const userId = req.user.uid;


        //first find completed workouts from this program
        const completedWorkouts = await completedWorkoutModel.find({
            workoutPlanId, userId
        });

        //calculate total volume from completedWorkouts 
        const totalVolume = completedWorkouts.reduce((acc, workout) => acc + workout.totalVolume, 0);

        // safe to use as plans end date because this function will only run when the plan is done and being submitted
        const endDate = new Date();


        const completedPlan = new completedProgramModel({
            workoutPlanId,
            userId: userId,
            name: name,
            startDate: startDate,
            endDate: endDate,
            duration: duration,
            totalVolume: totalVolume,
        });

        await completedPlan.save();

        res.status(201).json({message: 'completed program saved', completedPlan})

    } catch(error) {
        console.error('could not post program', error);
        res.status(500).json({message: 'could not post completed program to db'});
    }
    


}
