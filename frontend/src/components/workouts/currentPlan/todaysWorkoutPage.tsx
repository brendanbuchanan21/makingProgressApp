
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { RootState } from "../../../redux/store";
import './todaysWorkoutPage.css'
import NavBar from "../../dashboard/navbar";
import { Exercise, resetWorkoutState, SetDetails, removeSetFromExercise, deleteExercise, updateDayCompletion } from "../../../redux/workoutSlice";
import trashImg from '../../../images/deleteTrash.svg'
import editMarker from '../../../images/editMarker.svg'
import deleteMarker from '../../../images/deleteMarker.svg'
import { addSetToExercise, updateSetDetails } from "../../../redux/workoutSlice";
import { useAddSetToExerciseApiMutation, useDeleteExerciseApiMutation, useDeleteSetFromExerciseApiMutation, useUpdateWorkoutCompletionApiMutation } from "../../../redux/workoutApi";
import { usePostCompletedExerciseMutation } from "../../../redux/completedWorkoutApi";
import { useNavigate } from "react-router-dom";
// i need to grab the workout plan from the redux store? 
// display the first day in the plan that isn't completed 

const TodaysWorkoutPage = () => {


    const dispatch = useDispatch();
    const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);



    const firstIncompleteWorkout = currentPlan?.weeks.flatMap((week) => week.days)?.find((day) => !day.isCompleted);

    if(!firstIncompleteWorkout) {
      return;
    }

    console.log(firstIncompleteWorkout, 'lool');
    const [editMode, setEditMode] = useState(false);

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




    const handResetState = () => {
        dispatch(resetWorkoutState());
    }
  
    if (!currentPlan || !currentPlan.weeks) {
        return <h1>No active workout plan found.</h1>;
    }


    const [addingSetToExercise] = useAddSetToExerciseApiMutation();
    const [deleteSetFromExercise] = useDeleteSetFromExerciseApiMutation();
    const [deleteExerciseApi] = useDeleteExerciseApiMutation();
    

    //get the week number
    const weekIndex = currentPlan.weeks.findIndex(week =>
      week.days.some(day => day.day === firstIncompleteWorkout?.day) // Match based on the day name
    );
    
    const weekNumber = weekIndex !== -1 ? weekIndex + 1 : null; // Convert to 1-based index
    

    const handleAddSet = async (exercise: Exercise) => {

      try {

        if (currentPlan && currentPlan.id && weekNumber !== null && firstIncompleteWorkout && exercise.id) {
          const newSetNumber = exercise.sets.length + 1;
          const newSet: SetDetails = {
            setNumber: newSetNumber,
            reps: null,
            weight: null,
            rir: null,
          };
          console.log(exercise.id, 'ayyy check it')
          const result = await addingSetToExercise({
            workoutId: currentPlan.id,
            weekNumber,
            day: firstIncompleteWorkout.day,
            exerciseId: exercise.id,
            newSet,
          });
            console.log(result, 'wtf man please work');
          console.log(result.data, 'here is the result data');
          if (result.data && result.data.newSet.id) { // Check if the result and ID exist
            const newSetWithId = {
              ...newSet,
              id: result.data.newSet.id, // Add the returned ID
            };
    
    
          dispatch(
            addSetToExercise({
              weekNumber,
              day: firstIncompleteWorkout.day,
              exerciseId: exercise.id,
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
        if (currentPlan && currentPlan.id && weekNumber !== null && firstIncompleteWorkout && exercise.id && set.id) {
          console.log("yeah boiii");
            await deleteSetFromExercise({
              workoutId: currentPlan.id,
              weekNumber,
              day: firstIncompleteWorkout.day,
              exerciseId: exercise.id,
              setId: set.id,
            });
            dispatch(
              removeSetFromExercise({
                weekNumber,
                day: firstIncompleteWorkout.day,
                exerciseId: exercise.id,
                setId: set.id,
              })
            );
          } else {
            console.warn('Missing required data to delete set.');
          }
        } catch (error) {
          console.error('Error deleting set:', error);
        }
  }

  const deleteExerciseFromCurrentDay = async (exercise: Exercise) => {

    if (!window.confirm("Are you sure you want to delete this exercise?")) {
      return; // Exit if the user cancels.
    }

    try {
      if(exercise.id && currentPlan &&
        currentPlan.id &&
        weekNumber !== null &&
        firstIncompleteWorkout) {

        await deleteExerciseApi({
          workoutId: currentPlan.id,
          exerciseId: exercise.id,
          weekNumber,
          day: firstIncompleteWorkout.day
        }).unwrap();

        console.log('exercise deletion api call succeeded');

        dispatch(deleteExercise({
          weekNumber,
          day: firstIncompleteWorkout.day,
          exerciseId: exercise.id
        }))

      } else {
        console.warn('missing data required for exercise deletion');
      }

     
    } catch (error) {
      console.error('the try block did not execute:', error);
    }

  }


  // handle submitting the workout 


  const sendCompletedExercise = async (completedWorkout: any) => {
    try {
      
      console.log("📨 Sending workout data:", JSON.stringify(completedWorkout, null, 2));
      const response = await postCompletedExercise(completedWorkout).unwrap();
      console.log("Workout successfully logged:", response);
    } catch (error) {
      console.error("API request failed:", JSON.stringify(error, null, 2));
    }
  }

  const completedWorkoutUpdate = async (completedWorkout: any) => {
    try {
      console.log(completedWorkout, 'yo why not?')
      const response = await updateCompletedWorkout({
        workoutPlanId: completedWorkout.workoutPlanId,
        weekNumber: completedWorkout.weekNumber,
        day: completedWorkout.day,
        isCompleted: true 
      }).unwrap();
      console.log('workout succesfully updated document as completed:', response);

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
      return exercise.id ? completedExercises[exercise.id] : false;
    });
    if (!allComplete) {
      alert("Please mark all exercises as complete before submitting the workout.");
      return;
    }
    
    if(firstIncompleteWorkout) {
      let weekNumber = null;
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
        workoutPlanId: currentPlan.id,
        weekNumber: weekNumber,
        day: firstIncompleteWorkout.day,
        exercises: firstIncompleteWorkout.exercises

      }
      try {
        sendCompletedExercise(completedWorkout);
        completedWorkoutUpdate(completedWorkout)

        console.log("✅ Workout submission successful, navigating...");
        navigate('/workouts');
      } catch (error) {
        console.error("❌ Error submitting workout, staying on page:", error);
      }
      

      
      
    } else {
      console.error('workout plan data is missing');
    }
  }
  


    return (
        <>
       <NavBar />
<section className="current-workout-page">
  <div className="current-workout-page-header-div">
    <h1>Current Workout</h1>
  </div>
  <div className="current-workout-page-main-content-div">
    {firstIncompleteWorkout ? (
      <div className="workout-card">
        <div className="workout-card-day-name-div">
          <h2>{firstIncompleteWorkout.day}</h2>
        </div>
        <ul>
        <ul>
  {firstIncompleteWorkout.exercises.length > 0 ? (
    firstIncompleteWorkout.exercises.map((exercise) => (
      <div key={exercise.id} className="exercise-card">
        <div className="exercise-card-header-div">
          <h3>{exercise.name}</h3>
          <img src={trashImg} alt="" className="trash-img" onClick={() => deleteExerciseFromCurrentDay(exercise)} />
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
                    handleSetChange(exercise.id, set.id, "weight", e.target.value)
                  }
                />
              </div>
              <div className="set-cell">
                <input
                  type="number"
                  min="0"
                  value={set.reps === null ? "" : set.reps}
                  onChange={(e) =>
                    handleSetChange(exercise.id, set.id, "reps", e.target.value)
                  }
                />
              </div>
              <div className="set-cell">
                <input
                  type="number"
                  min="0"
                  value={set.rir === null ? "" : set.rir}
                  onChange={(e) =>
                    handleSetChange(exercise.id, set.id, "rir", e.target.value)
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
                        checked={exercise.id ? !!completedExercises[exercise.id] : false} 
                        onChange={() => {
                          if (exercise.id) {
                            toggleExerciseCompletion(exercise.id);
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

        </ul>
      </div>
    ) : (
      <p>No days found brother</p>
    )}
  </div>
  <button onClick={handResetState}>Reset</button>
  <div className="submit-todays-workout-div">
    <button onClick={handleSubmitWorkout}>Complete Workout</button>
  </div>
</section>
        </>
    )
}

export default TodaysWorkoutPage;