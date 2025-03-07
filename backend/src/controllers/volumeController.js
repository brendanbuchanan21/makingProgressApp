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

export const aggregateTotalVolumeByTimescale = async (req, res) => {
    try {
      const { timescale = "week" } = req.query;
      let groupId;
  
      if (timescale === "month") {
        // Group by year-month using the `date` field
        groupId = { $dateToString: { format: "%Y-%m", date: "$date" } };
      } else if (timescale === "year") {
        // Group by year using the `date` field
        groupId = { $dateToString: { format: "%Y", date: "$date" } };
      } else {
        // Default to week view using ISO week info from the `date` field
        groupId = {
          $concat: [
            { $toString: { $isoWeekYear: "$date" } },
            "-",
            { $toString: { $isoWeek: "$date" } }
          ]
        };
      }
  
      const result = await completedWorkoutModel.aggregate([
        {
          $group: {
            _id: groupId,
            totalVolume: { $sum: "$totalVolume" }
          }
        },
        { $sort: { _id: 1 } }
      ]);
  
      const formatted = result.map(item => ({
        id: item._id,
        totalVolume: item.totalVolume
      }));
  
      res.status(200).json(formatted);
    } catch (error) {
      console.error("Error aggregating total volume:", error);
      res.status(500).json({ message: "Could not aggregate total volume by timescale" });
    }
  };
  
