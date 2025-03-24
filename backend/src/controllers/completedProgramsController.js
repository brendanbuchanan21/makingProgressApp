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
        const endDate = new Date().toISOString().split('T')[0]; 


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

export const fetchCompletedPrograms = async (req, res) => {

    try {
        const userId = req.user.uid;

        if(!userId) {
            res.status(400).json({message: 'could not find the user id'});
        }
        const completedPrograms = await completedProgramModel.find({userId});

        if (completedPrograms.length === 0) {
            return res.status(200).json({message: 'no completed programs found for this user', completedPrograms: []}); // Or just return []
        }

        res.status(200).json({message: 'completed programs coming back', completedPrograms});


    } catch (error) {
        console.error('could not process your request', error);
        res.status(500).json({message: 'could not process request in try block'});
    }
}
