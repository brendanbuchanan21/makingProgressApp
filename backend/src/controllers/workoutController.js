
import workoutModel from "../models/workoutModel.js";
import mongoose, { mongo } from "mongoose";



// we are going to create a post workout plan 

export const newWorkoutPlan = async (req, res) => {
     const { name, exercises, days, duration, startDate, weeks } = req.body;
     const userId = req.user.uid;
     try {
     const newPlan = await workoutModel.create({ userId, name, exercises, days, duration, startDate, weeks })
        res.status(200).json(newPlan)
     } catch (error) {
        res.status(400).json({error: error.message})
     }
}


// retrieve entire workout plan 

export const getWorkoutPlan = async (req, res) => {
    const { workoutPlanId } = req.params
    const userId = req.user.uid;
    console.log(userId, '💜');
    console.log(workoutPlanId, '⭐️');
    if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(workoutPlanId)) {
        return res.status(404).json({error: 'Nope'});
    }

    const workoutPlan = await workoutModel.findOne({
        _id: workoutPlanId,
        userId: userId
    });
    
    if(!workoutPlan) {
        return res.status(404).json({error: "no such workout plan"});
    }

    res.status(200).json(workoutPlan);
}


export const addExerciseToDay = async (req, res) => {
    const { id, weekNumber, day } = req.params;
    const { name, muscleGroup, sets } = req.body;

    try {
        const updatedWorkout = await workoutModel.findOneAndUpdate(
            { 
                _id: id,  // Find the workout by its unique ID
                "weeks.weekNumber": parseInt(weekNumber), // Find the week inside `weeks` array
            },
            { 
                $push: { "weeks.$.days.$[dayMatch].exercises": {  _id: new mongoose.Types.ObjectId(), name, muscleGroup, sets } } 
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
          // Replace this
let addedExercise = dayPlan?.exercises[dayPlan.exercises.length - 1];

if (addedExercise) {
    // Convert Mongoose document to a plain JavaScript object
    const plainExercise = addedExercise.toObject();

    // Ensure `sets` exist before mapping
    plainExercise.sets = plainExercise.sets?.map(set => ({
        ...set, // Spread existing properties
        id: set._id.toString(), // Convert `_id` to `id`
    })) || []; // Default to an empty array if `sets` is undefined

   

    // Remove `_id` from each set object
    plainExercise.sets.forEach(set => delete set._id);

    res.json(plainExercise);
}


        

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
        const { name, muscleGroup, sets} = req.body;

        const updatedFields = {};

        if(name) updatedFields["weeks.$.days.$[dayMatch].exercises.$[exerciseMatch].name"] = name;
        if(muscleGroup) updatedFields["weeks.$.days.$[dayMatch].exercises.$[exerciseMatch].muscleGroup"] = muscleGroup;
        if (sets) updatedFields["weeks.$.days.$[dayMatch].exercises.$[exerciseMatch].sets"] = sets;

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

    export const addSetToExercise = async (req, res) => {
            console.log('this is logging when you add a set');
        try {

        const { workoutId, weekNumber, day, exerciseId } = req.params;
        const { newSet } = req.body;

        const workoutPlan = await workoutModel.findById(workoutId);
        if(!workoutPlan) {
            return res.status(404).json({message: 'problem retrieving the workoutPlan'});
        }

        //finding the week 
        const week = workoutPlan.weeks.find((w) => w.weekNumber === parseInt(weekNumber));

        console.log('sorry cunt what is the week number,', weekNumber);
        if(!week) {
            return res.status(401).json({message: 'found workout plan but could not locate week'});
        }

        const dayObject = week.days.find((d) => d.day === day);

        if(!dayObject) {
            return res.status(409).json({message: 'found week but not day object'});
        }
       console.log(dayObject, 'hmm whats up bro')
        const exercise = dayObject.exercises.find((e) => e._id.toString() === exerciseId.toString());
        if(!exercise) {
            return res.status(411).json({message: 'located everything but the correct exercise'});
        }

        const setWithId = { ...newSet, _id: new mongoose.Types.ObjectId() };

        exercise.sets.push(setWithId);

        await workoutPlan.save();
       res.status(201).json({ newSet: setWithId});


        } catch (error) {
            console.error('there was an error caught:', error);
            res.status(500).json({message: 'internal servor error'});
        }
    }


    export const deleteSet = async (req, res) => {

        try{

            const { workoutId, weekNumber, day, exerciseId, setId } = req.params;

            const workoutPlan = await workoutModel.findById(workoutId);
            if (!workoutPlan) {
              return res.status(404).json({ message: 'Workout plan not found' });
            }
        
            const week = workoutPlan.weeks.find(
              (w) => w.weekNumber === parseInt(weekNumber)
            );
            if (!week) {
              return res.status(404).json({ message: 'Week not found' });
            }
        
            const dayObject = week.days.find((d) => d.day === day);
            if (!dayObject) {
              return res.status(404).json({ message: 'Day not found' });
            }
        
            const exercise = dayObject.exercises.find(
              (e) => e._id.toString() === exerciseId
            );
            if (!exercise) {
              return res.status(404).json({ message: 'Exercise not found' });
            }
        
            // Find and remove the set
            exercise.sets = exercise.sets.filter((set) => set._id.toString() !== setId);
        
            await workoutPlan.save();
        
          return res.status(200).json({message: 'set deleted successfully'})


        } catch(error) {
            console.error('could not delete the exercise:', error)
            res.status(500).json({message: 'uhh ohhh, internal servor error!'});
        }
    }


export const updateWorkoutDay = async (req, res) => {
    try {

    const { workoutPlanId, weekNumber, day } = req.params;
    const { isCompleted } = req.body;

    const workoutPlan = await workoutModel.findById(workoutPlanId);
        if(!workoutPlan) {
            return res.status(400).json({message: 'could not locate workoutPlan' });
        }
        const week = workoutPlan.weeks.find((w) => w.weekNumber === parseInt(weekNumber));

        if(!week) {
            return res.status(400).json({message: 'could not locate the correct week in DB'});
        }

        const dayPlan = week.days.find((d) => d.day === day);
        if(!dayPlan) {
            return res.status(400).json({message: 'could not locate the correct day in DB'});
        }
        dayPlan.isCompleted = isCompleted;

        await workoutPlan.save();

        return res.status(200).json({message: 'wohoooo, we correctly updated completed'});

    } catch (error) {
        console.error('something was incorrect processing your query:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteWeekFromPlan = async (req, res) => {
    
    try {
        const { workoutPlanId, weekNumber } = req.params;


        if(!workoutPlanId || !weekNumber) {
            return res.status(404).json({message: 'did not receive id or week number'});
        }

        const workoutPlan = await workoutModel.findById(workoutPlanId);

        if(!workoutPlan) {
            return res.status(400).json({message: 'could not locate workout plan in backend'});
        }

        const weekNumberToDelete = parseInt(weekNumber, 10);
        workoutPlan.weeks = workoutPlan.weeks.filter(w => w.weekNumber !== weekNumberToDelete);

        await workoutPlan.save();
        
        return res.status(200).json({message: 'succesfully deleted week'});

    } catch (error) {
        console.error('could not process request', error);
        return res.status(500).json(error);
    }
}

export const addWeekToPlan = async (req, res) => {
    const {workoutPlanId} = req.params;
    const {weekNumber, days} = req.body;
    try {

        const workoutPlan = await workoutModel.findById(workoutPlanId);
        if (!workoutPlan) {
            return res.status(404).json({message: 'could not locate your workout plan'});
        }

        const weekNumberToAdd = parseInt(weekNumber, 10);

        const newWeek = {
            weekNumber: weekNumberToAdd,
            days: days
        }

        workoutPlan.weeks.push(newWeek);

        await workoutPlan.save();

        return res.status(200).json(workoutPlan);


    } catch (error) {
        console.error('could not process request', error);
        return res.status(500).json(error);
    }
}

export const addDuplicatedWeeks = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedWorkoutPlan = req.body;


        const workoutPlan = await workoutModel.findById(id);

        if(!workoutPlan) {
            return res.status(400).json({message: 'could not locate workout plan by id'});

        }
        workoutPlan.weeks = updatedWorkoutPlan.weeks;

        await workoutPlan.save();

        return res.status(200).json(workoutPlan);


    } catch (error) {
        console.error(error)
        return res.status(500).json({message: 'internal server error'});
    }
}