import completedWorkoutModel from "../models/completedWorkoutsModel.js";
import noPlanWorkoutModel from "../models/noPlanWorkoutModel.js";
// controllers/aggregationController.js (or similar file name)


export const aggregateMuscleGroupVolume = async (req, res) => {
  try {
      // Start aggregation pipeline on the first collection (completedWorkoutModel)
      const combinedMuscleGroupVolumes = await completedWorkoutModel.aggregate([
          // --- Pipeline for completedWorkoutModel ---
          {
              $project: { // Select only necessary fields from completedWorkoutModel
                  exercises: 1,
                  _id: 0 // Exclude _id
              }
          },
          { $unwind: "$exercises" }, // Unwind the exercises array
          {
               // Optional filter after unwind, if needed
              $match: { "exercises.muscleGroup": { $ne: null, $exists: true } }
          },
          {
              $project: { // Standardize field names for grouping
                  muscleGroup: "$exercises.muscleGroup",
                  muscleGroupVolume: "$exercises.muscleGroupVolume"
              }
          },

          // --- Union with the second collection (noplansworkouts) ---
          {
              $unionWith: {
                  coll: "noplanworkouts", 
                  pipeline: [
                      // Pipeline specific to noplansworkouts before unioning
                      {
                          $project: { // Select only necessary fields from noplansworkouts
                              exercises: 1,
                              _id: 0
                          }
                      },
                      { $unwind: "$exercises" },
                      {
                           // Optional filter after unwind, if needed
                          $match: { "exercises.muscleGroup": { $ne: null, $exists: true } }
                      },
                      {
                          $project: { // Standardize field names to match the first pipeline's output
                              muscleGroup: "$exercises.muscleGroup",
                              muscleGroupVolume: "$exercises.muscleGroupVolume"
                          }
                      }
                  ]
              }
          },

          // --- Common aggregation stages for the combined data ---
          {
              $group: {
                  _id: "$muscleGroup", // Group by the standardized muscle group field
                  totalVolume: { $sum: "$muscleGroupVolume" } // Sum the standardized volume
              }
          },
          { $sort: { totalVolume: -1 } }, // Sort by highest volume

          // --- Final formatting ---
          {
              $project: {
                  _id: 0, // Exclude the default _id
                  id: "$_id", // Rename _id to id for the final output
                  totalVolume: 1
              }
          }
      ]);

      res.status(200).json(combinedMuscleGroupVolumes); // Send the directly formatted result

  } catch (error) {
      console.error("Error aggregating combined muscle group volume:", error);
      res.status(500).json({ message: 'Could not aggregate muscle group volume from both collections' });
  }
};

export const aggregateTotalVolumeByTimescale = async (req, res) => {
  try {
      const { timescale = "week" } = req.query; // Default to 'week' if not provided
      let groupFormat; // To hold the date format string for $dateToString

      // Determine the date format string based on timescale
      if (timescale === "month") {
          groupFormat = "%Y-%m"; // Year-Month
      } else if (timescale === "year") {
          groupFormat = "%Y"; // Year
      } else {
          // For 'week', we'll calculate the ISO Year-Week format later
          groupFormat = null;
      }

      // Start aggregation pipeline on the first collection (completedWorkoutModel)
      const combinedTotalVolumes = await completedWorkoutModel.aggregate([
           // --- Pipeline for completedWorkoutModel ---
           {
              $project: { // Standardize fields before union
                  _id: 0,
                  // workoutDate already a Date object here
                  workoutDate: "$date",            // Standardize date field name
                  workoutVolume: "$totalVolume"    // Standardize volume field name
              }
          },
          {
               // Optional: Filter out documents without necessary fields before union
              $match: { workoutDate: { $ne: null }, workoutVolume: { $ne: null } }
          },

          // --- Union with the second collection (noplansworkouts) ---
          {
              $unionWith: {
                  coll: "noplanworkouts",
                  pipeline: [
                      // Pipeline specific to noplansworkouts before unioning
                      {
                          $project: { // Select and standardize fields
                              _id: 0,
                              // *** Convert dateDone String to Date Object ***
                              workoutDate: { $toDate: "$dateDone" },
                              workoutVolume: "$totalVolume"
                          }
                      },
                      {
                           // Optional: Filter out documents without necessary fields or where date conversion failed
                           $match: { workoutDate: { $ne: null }, workoutVolume: { $ne: null } }
                      }
                  ]
              }
          },

          // --- Common aggregation stages for the combined data ---
          {
              // Calculate the grouping key based on timescale AFTER union, using the standardized 'workoutDate'
              $project: {
                  totalVolume: "$workoutVolume",
                  groupKey: groupFormat // Use the specific format string if month or year
                      ? { $dateToString: { format: groupFormat, date: "$workoutDate" } }
                      : { // Calculate week format (ISO Year-Www) for default/week timescale
                          $concat: [
                              { $toString: { $isoWeekYear: "$workoutDate" } },
                              "-W", // Add 'W' for clarity and sorting
                              // Pad week number with leading zero if needed (e.g., W01, W09, W10)
                              { $cond: {
                                  if: { $lt: [{ $isoWeek: "$workoutDate" }, 10] },
                                  then: { $concat: ["0", { $toString: { $isoWeek: "$workoutDate" } }] },
                                  else: { $toString: { $isoWeek: "$workoutDate" } }
                              }}
                          ]
                      }
              }
          },
          {
              $group: {
                  _id: "$groupKey", // Group by the calculated timescale key
                  totalVolume: { $sum: "$totalVolume" } // Sum volume
              }
          },
          { $sort: { _id: 1 } }, // Sort by the timescale key (alphanumeric sort works: YYYY, YYYY-MM, YYYY-Www)

           // --- Final formatting ---
          {
              $project: {
                  _id: 0,
                  id: "$_id", // Rename _id to id for the final output
                  totalVolume: 1
              }
          }
      ]);

      res.status(200).json(combinedTotalVolumes); // Send the directly formatted result

  } catch (error) {
      console.error("Error aggregating combined total volume by timescale:", error);
      res.status(500).json({ message: "Could not aggregate total volume by timescale from both collections" });
  }
};