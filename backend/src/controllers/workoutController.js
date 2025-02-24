import workoutModel from "../models/workoutModel.js";
import mongoose, { mongo } from "mongoose";



// we are going to create a post workout plan 

export const newWorkoutPlan = async (req, res) => {
     const { name, exercises, days, duration, weeks } = req.body;
     
     try {
     const newPlan = await workoutModel.create({ name, exercises, days, duration, weeks })
        res.status(200).json(newPlan)
     } catch (error) {
        res.status(400).json({error: error.message})
     }
}

// retrieve entire workout plan 

export const getWorkoutPlan = async (req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Nope'});
    }

    const workoutPlan = await workoutModel.findById(id);
    if(!workoutPlan) {
        return res.status(404).json({error: "no such workout plan"});
    }

    res.status(200).json(workoutPlan);
}


export const addExerciseToDay = async (req, res) => {
    const { id, weekNumber, day } = req.params;
    const { name, muscleGroup, sets, repsInReserve } = req.body;

    try {
        const updatedWorkout = await workoutModel.findOneAndUpdate(
            { 
                _id: id,  // Find the workout by its unique ID
                "weeks.weekNumber": parseInt(weekNumber), // Find the week inside `weeks` array
            },
            { 
                $push: { "weeks.$.days.$[dayMatch].exercises": {  _id: new mongoose.Types.ObjectId(), name, muscleGroup, sets, repsInReserve } } 
            },
            { 
                arrayFilters: [{ "dayMatch.day": day }], 
                new: true 
            }

        )
        if (!updatedWorkout) {
            return res.status(404).json({ message: "Workout or day not found." });
        }

          // Find the newly added exercise (last one in the array)
          const week = updatedWorkout.weeks.find(w => w.weekNumber === parseInt(weekNumber));
          const dayPlan = week?.days.find(d => d.day === day);
          const addedExercise = dayPlan?.exercises[dayPlan.exercises.length - 1];
  
          res.json(addedExercise); 

    } catch (error) {
        console.error("Error adding exercise:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    }


    //delete a workout from the plan 
    export const deleteAnExercise = async (req, res) => {
        const { id, weekNumber, day, exerciseId } = req.params

        try {
            const updatedDay = await workoutModel.findOneAndUpdate(
                {
                    //find the correct index
                    _id: id,
                    "weeks.weekNumber": weekNumber,
                },
                {
                    $pull: { "weeks.$.days.$[dayMatch].exercises": {_id: exerciseId}}
                },
                {
                    arrayFilters: [{"dayMatch.day": day}],
                    new: true
                },
            );

            if(!updatedDay) {
                res.status(404).json({message: "exercise not found"});
            }
            res.status(200).json({message: "exercise succesfully deleted"});
        } catch (error) {
            console.error("Error deleting exercise:", error)
            res.status(400).json({message: "uh oh! here is your issue:", error})
        }
        
    }

    export const editExercise = async (req, res) => {
        const { workoutId, weekNumber, day, exerciseId } = req.params;
        const { name, muscleGroup, sets, repsInReserve } = req.body;

        console.log("Received edit request:");
    console.log("Workout ID:", workoutId);
    console.log("Exercise ID:", exerciseId);
    console.log("Week Number:", weekNumber);
    console.log("Day:", day);
    console.log("Update Data:", req.body);
        const updatedFields = {};

        if(name) updatedFields["weeks.$.days.$[dayMatch].exercises.$[exerciseMatch].name"] = name;
        if(muscleGroup) updatedFields["weeks.$.days.$[dayMatch].exercises.$[exerciseMatch].muscleGroup"] = muscleGroup;
        if (sets) updatedFields["weeks.$.days.$[dayMatch].exercises.$[exerciseMatch].sets"] = sets;
        if(repsInReserve) updatedFields["weeks.$.days.$[dayMatch].exercises.$[exerciseMatch].repsInReserve"] = repsInReserve;

        try {
            const editedExercise = await workoutModel.findOneAndUpdate(
                {
                    _id: workoutId,
                    "weeks.weekNumber": weekNumber,
                },
                {
                    $set: updatedFields
                },
                {
                    arrayFilters: [{"dayMatch.day": day},
                        {"exerciseMatch._id": exerciseId}
                    ],
                    new: true
                }
            )
            if(!editedExercise) {
                return res.status(404).json({message: "Exercise not found"});
            }

            res.status(200).json(editedExercise);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "could not locate exercise"});
        }
    }


    export const getExerciseFromPlan = async (req, res) => {
        const { id, weekNumber, day, exerciseId } = req.params

        try {
            const theworkoutPlan = await workoutModel.findById(id);
            if(!theworkoutPlan) {
                return res.status(404).json({message: "not finding the workout plan"});
            }

            const week = theworkoutPlan.weeks.find(w => w.weekNumber === parseInt(weekNumber));
            if(!week) {
                return res.status(404).json({message: "not finding the accurate week"});
            }

            const dayObj = week.days.find(d => d.day === day) 
            if(!dayObj) {
                return res.status(404).json({message: "not find the day object"});
            }

            const exercise = dayObj.exercises.find(exercise => exercise._id.toString() === exerciseId);
            if(!exercise) {
                return res.status(404).json({message: "exercise not found :("});
            }
            res.json(exercise);


        } catch (error) {
            console.error("couldnt retrieve exercise:", error);
            res.status(500).json({message: "internal web server error"});
        }
        // the params 
        // 
    };


    //delete the entire workout plan 
    export const deleteEntireProgram = async (req, res) => {
        const { id } = req.params

        try {
            const theWorkoutProgram = await workoutModel.findByIdAndDelete(id);
            if(!theWorkoutProgram) {
                res.status(404).json({message: 'could not find program via id'});
            }
            res.status(200).json({message: 'succesfully deleted program:', theWorkoutProgram});
        } catch (error) {
            console.error('couldnt find the program');
        }
    }



