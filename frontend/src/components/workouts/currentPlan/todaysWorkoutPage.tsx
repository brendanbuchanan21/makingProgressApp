
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { RootState } from "../../../redux/store";
import './todaysWorkoutPage.css'
import NavBar from "../../dashboard/navbar";
import { Exercise, SetDetails, removeSetFromExercise, deleteExercise, updateDayCompletion } from "../../../redux/workoutSlice";
import trashImg from '../../../images/deleteTrash.svg'
import editMarker from '../../../images/editMarker.svg'
import deleteMarker from '../../../images/deleteMarker.svg'
import { addSetToExercise, updateSetDetails } from "../../../redux/workoutSlice";
import { useAddSetToExerciseApiMutation, useDeleteExerciseApiMutation, useDeleteSetFromExerciseApiMutation, useUpdateWorkoutCompletionApiMutation } from "../../../redux/workoutApi";
import { usePostCompletedExerciseMutation } from "../../../redux/completedWorkoutApi";
import { useNavigate } from "react-router-dom";
import backArrow from '../../../images/backArrow.svg';
import IncompleteWorkoutPopUp from "./incompleteWorkoutPopUp";

// i need to grab the workout plan from the redux store? 
// display the first day in the plan that isn't completed 

const TodaysWorkoutPage = () => {

  const dispatch = useDispatch();
  const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);

  const firstIncompleteWeek = currentPlan?.weeks.find((week) =>
  week.days.some((day) => !day.isCompleted)
  );
  const firstIncompleteWorkout = firstIncompleteWeek?.days.find((day) => !day.isCompleted);
  
  if(!firstIncompleteWorkout) {
  return;
  }
    
  // usestate section
  const [editMode, setEditMode] = useState(false);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<Exercise | null>(null);
  const [cantDeletePopUp, setCantDeletePopUp] = useState(false);
  const [showIncomplete, setShowIncomplete] = useState(false);

  const navigate = useNavigate();
    

  const [completedExercises, setCompletedExercises] = useState<{ [key: string]: boolean }>({});
  const [postCompletedExercise] = usePostCompletedExerciseMutation(); 
  const [updateCompletedWorkout] = useUpdateWorkoutCompletionApiMutation();



const toggleExerciseCompletion = (exerciseId: string) => {
  setCompletedExercises((prev) => ({
  ...prev,
  [exerciseId]: !prev[exerciseId], // Toggle completion state
  }));
};

 

const handleSetChange = (exerciseId: string | any, setId: string | any, field: keyof SetDetails, value: string | number) => {
      
      
  const parsedValue = value === "" ? null : Number(value);

  dispatch(
  updateSetDetails({
  weekNumber,
  day: firstIncompleteWorkout.day,
  exerciseId,
  setId,
  updatedSet: { [field]: parsedValue },
  })
  );
};

  
  if (!currentPlan || !currentPlan.weeks) {
  return <h1>No active workout plan found.</h1>;
  }


  const [addingSetToExercise] = useAddSetToExerciseApiMutation();
  const [deleteSetFromExercise] = useDeleteSetFromExerciseApiMutation();
  const [deleteExerciseApi] = useDeleteExerciseApiMutation();
    

  const weekNumber = firstIncompleteWeek?.weekNumber;
  
const handleAddSet = async (exercise: Exercise) => {

  try {

  if (currentPlan && currentPlan._id && weekNumber !== null && firstIncompleteWorkout && exercise._id) {
  const newSetNumber = exercise.sets.length + 1;
  const newSet: SetDetails = {
  setNumber: newSetNumber,
  reps: null,
  weight: null,
  rir: null,
  };
         
  const result = await addingSetToExercise({
  workoutId: currentPlan._id,
  weekNumber,
  day: firstIncompleteWorkout.day,
  exerciseId: exercise._id,
  newSet,
  });
  if (result.data && result.data.newSet._id) { // Check if the result and ID exist
  const newSetWithId = {
  ...newSet,
  _id: result.data.newSet._id, // Add the returned ID
  };
    
    
  dispatch(
  addSetToExercise({
  weekNumber,
  day: firstIncompleteWorkout.day,
  exerciseId: exercise._id,
  newSet: newSetWithId,
  })
  );
  } else {
  console.error('Failed to get the new set ID from the backend.');
  }
  } else {
  console.warn('Missing required data to add set.');
  }
  } catch (error) {
  console.error('Error adding set:', error);
  }
  };


const deleteSet = async (set: SetDetails, exercise: Exercise) => {
  try { 
  if (currentPlan && currentPlan._id && weekNumber !== null && firstIncompleteWorkout && exercise._id && set._id) {
  await deleteSetFromExercise({
  workoutId: currentPlan._id,
  weekNumber,
  day: firstIncompleteWorkout.day,
  exerciseId: exercise._id,
  setId: set._id,
  });

  dispatch(
  removeSetFromExercise({
  weekNumber,
  day: firstIncompleteWorkout.day,
  exerciseId: exercise._id,
  setId: set._id,
  }));

  } else {
  console.warn('Missing required data to delete set.');
  }
  } catch (error) {
  console.error('Error deleting set:', error);
  }
}

const deleteExerciseFromCurrentDay = async (exercise: Exercise) => {

  try {
  if(exercise._id && currentPlan &&
  currentPlan._id &&
  weekNumber !== null &&
  firstIncompleteWorkout) {

  await deleteExerciseApi({
  workoutId: currentPlan._id,
  exerciseId: exercise._id,
  weekNumber,
  day: firstIncompleteWorkout.day
  }).unwrap();


  dispatch(deleteExercise({
  weekNumber,
  day: firstIncompleteWorkout.day,
  exerciseId: exercise._id
  }))

  } else {
  console.warn('missing data required for exercise deletion');
  }

     
  } catch (error) {
  console.error('the try block did not execute:', error);
  }

}



const sendCompletedExercise = async (completedWorkout: any) => {
  try {
  await postCompletedExercise(completedWorkout).unwrap();
  } catch (error) {
  console.error("API request failed:", JSON.stringify(error, null, 2));
  }

}

const completedWorkoutUpdate = async (completedWorkout: any) => {
  try {
  await updateCompletedWorkout({
  workoutPlanId: completedWorkout.workoutPlanId,
  weekNumber: completedWorkout.weekNumber,
  day: completedWorkout.day,
  isCompleted: true 
  }).unwrap();
   

  dispatch(updateDayCompletion({
  weekNumber: completedWorkout.weekNumber,
  day: completedWorkout.day,
  isCompleted: true
  }))

  } catch (error) {
  console.error(error, 'we could not update the workout to complete');
  return;
  }
}




const handleSubmitWorkout = async () => {

  const allComplete = firstIncompleteWorkout.exercises.every((exercise) => {
  return exercise._id ? completedExercises[exercise._id] : false;
  });
  if (!allComplete) {
  setShowIncomplete(true);
  return;
  }

  let weekNumber = null;
  // this is to extract the week number for the completedworkout below
  if(firstIncompleteWorkout) {
  for (const week of currentPlan.weeks) {
  const foundDay = week.days.find(day => day._id === firstIncompleteWorkout._id);
  if (foundDay) {
  weekNumber = week.weekNumber;
  break; // Stop iterating once found
  }
  }
  } else {
  console.error('Workout day _id is missing.');
  return;
  }

  //directly pull data from the currentplan to send to backend
  if(currentPlan && currentPlan.weeks && currentPlan.weeks[0] && currentPlan.weeks[0].days[0]) {

  const completedWorkout = {
  workoutPlanId: currentPlan._id,
  weekNumber: weekNumber,
  day: firstIncompleteWorkout.day,
  exercises: firstIncompleteWorkout.exercises
  }
  try {
  sendCompletedExercise(completedWorkout);
  completedWorkoutUpdate(completedWorkout)
  } catch (error) {
  console.error("❌ Error submitting workout, staying on page:", error);
  }
  navigate('/workouts');
  } else {
  console.error('workout plan data is missing');
  }
}

const handleBackClick = () => {
    return navigate('/workouts');
}
  


    return (
        <>
       <NavBar />
<section className="current-workout-page">
  <div className="current-workout-page-header-div">
    <h1>Current Workout</h1>
  </div>
  <div className="current-workout-page-back-btn-div">
    <button className="back-btn-current-workout"><img src={backArrow} alt="" onClick={handleBackClick} /></button>
  </div>
  <div className="current-workout-page-main-content-div">
    {firstIncompleteWorkout ? (
      <div className="workout-card">
        <div className="workout-card-day-name-div">
          <h2>{firstIncompleteWorkout.day}</h2>
        </div>
        <ul>
  {firstIncompleteWorkout.exercises.length > 0 ? (
    firstIncompleteWorkout.exercises.map((exercise) => (
      <div key={exercise._id} className="exercise-card">
        <div className="exercise-card-header-div">
          <h3>{exercise.name}</h3>
          <img src={trashImg} alt="" className="trash-img" onClick={() => {
           if (firstIncompleteWorkout.exercises.length >= 2) {
            setExerciseToDelete(exercise);
            setShowDeletePopUp(true);
           } else {
            setCantDeletePopUp(true);
           }
           
          }}/>
        </div>

        <div className="exercise-card-button-container">
          <button onClick={() => handleAddSet(exercise)}>Add Set</button>
          <img src={editMarker} onClick={() => setEditMode((prev) => !prev)} style={{ cursor: "pointer" }} />
        </div>


        {/* Updated header row with an extra header for the set number */}
        <div className="header-row">
          <div className="column-header set-number-header">Set</div>
          <div className="column-header">Weight</div>
          <div className="column-header">Reps</div>
          <div className="column-header">RIR</div>
        </div>

        <div className="sets-container">
          {exercise.sets.map((set) => (
            <div key={set.setNumber} className="set-row">
              <div className="set-cell set-number-cell">
                {editMode && (
                  <img
                    src={deleteMarker}
                    alt="Delete set"
                    className="delete-marker"
                    onClick={() => deleteSet(set, exercise)}
                  />
                )}
                {set.setNumber}
              </div>
              <div className="set-cell">
                <input
                  type="number"
                  min="0"
                  value={set.weight === null ? "" : set.weight}
                  onChange={(e) =>
                    handleSetChange(exercise._id, set._id, "weight", e.target.value)
                  }
                />
              </div>
              <div className="set-cell">
                <input
                  type="number"
                  min="0"
                  value={set.reps === null ? "" : set.reps}
                  onChange={(e) =>
                    handleSetChange(exercise._id, set._id, "reps", e.target.value)
                  }
                />
              </div>
              <div className="set-cell">
                <input
                  type="number"
                  min="0"
                  value={set.rir === null ? "" : set.rir}
                  onChange={(e) =>
                    handleSetChange(exercise._id, set._id, "rir", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <div className="exercise-completion">
                    <label>Mark as Complete</label>
                      <input 
                        className="exercise-complete-checkbox"
                        type="checkbox" 
                        checked={exercise._id ? !!completedExercises[exercise._id] : false} 
                        onChange={() => {
                          if (exercise._id) {
                            toggleExerciseCompletion(exercise._id);
                          }
                        }} 
                      />
                    </div>
      </div>
    ))
  ) : (
    <li>No exercises scheduled.</li>
  )}
</ul>
      </div>
    ) : (
      <p>No days found brother</p>
    )}
  </div>
  <div className="submit-todays-workout-div">
      <button onClick={handleSubmitWorkout} className="complete-workout-btn">Complete Workout</button>
  </div>
  {showDeletePopUp && exerciseToDelete && (
  <div className="custom-modal-overlay">
    <div className="custom-modal-content">
      <h2 className="custom-modal-title">Delete Exercise</h2>
      <p className="custom-modal-message">
        Are you sure you want to delete <strong>{exerciseToDelete.name}</strong>?
      </p>
      <div className="custom-modal-buttons">
        <button
          className="confirm-btn"
          onClick={() => {
            deleteExerciseFromCurrentDay(exerciseToDelete);
            setShowDeletePopUp(false);
            setExerciseToDelete(null);
          }}
        >
          Yes, delete
        </button>
        <button
          className="cancel-btn"
          onClick={() => {
            setShowDeletePopUp(false);
            setExerciseToDelete(null);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
{cantDeletePopUp && (
   <div className="custom-modal-overlay">
   <div className="custom-modal-content">
     <h2 className="custom-modal-title">Can't Delete Exercise</h2>
     <p className="custom-modal-message">
       You can't delete the only exercise in your workout. Add another exercise before removing this one.
     </p>
     <div className="custom-modal-buttons">
       <button
         className="cancel-btn"
         onClick={() => setCantDeletePopUp(false)}
       >
         Close
       </button>
     </div>
   </div>
 </div>
)}
{showIncomplete && (
<IncompleteWorkoutPopUp 
onOk={() => setShowIncomplete(false)}
boolean={showIncomplete}
/>
)}

</section>
        </>
    )
}

export default TodaysWorkoutPage;