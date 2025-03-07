import completedWorkoutModel from "../models/completedWorkoutsModel.js";

export const aggregateMuscleGroupVolume = async (req, res) => {


    try {
        // muscle group volumes
        const muscleGroupVolumes = await completedWorkoutModel.aggregate([
          { $unwind: "$exercises" }, // Breaks exercises array into individual documents
          { 
            $group: {
            _id: "$exercises.muscleGroup", // Group by muscle group
            totalVolume: { $sum: "$exercises.muscleGroupVolume" } // Sum volume
            }
          },
          { $sort: { totalVolume: -1 } } // Sort by highest volume
          ]);

          // Convert _id to id
        const formattedVolumes = muscleGroupVolumes.map(item => ({
            id: item._id,
            totalVolume: item.totalVolume
        }));
          res.status(200).json(formattedVolumes);

    } catch (error) {
        console.error("Error aggregating muscle group volume:", error);
        res.status(500).json({message: 'could not aggregate the documents'});

    }
}