import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { RootState } from "../../../redux/store";
import './todaysWorkoutPage.css'
import NavBar from "../../dashboard/navbar";
import { Exercise, resetWorkoutState, SetDetails, removeSetFromExercise, deleteExercise } from "../../../redux/workoutSlice";
import trashImg from '../../../images/deleteTrash.svg'
import editMarker from '../../../images/editMarker.svg'
import deleteMarker from '../../../images/deleteMarker.svg'
import { addSetToExercise, updateSetDetails } from "../../../redux/workoutSlice";
import { useAddSetToExerciseApiMutation, useDeleteExerciseApiMutation, useDeleteSetFromExerciseApiMutation } from "../../../redux/workoutApi";


// i need to grab the workout plan from the redux store? 
// display the first day in the plan that isn't completed 

const TodaysWorkoutPage = () => {


    const dispatch = useDispatch();
    const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);

    const [editMode, setEditMode] = useState(false);

  //first workout day
  const firstWorkoutDay = currentPlan?.weeks[0]?.days[0];

  

    const handleSetChange = (exerciseId: string | undefined, setId: string | undefined, field: keyof SetDetails, value: number) => {
      
      dispatch(
        updateSetDetails({
          weekNumber,
          day: firstWorkoutDay.day,
          exerciseId,
          setId,
          updatedSet: { [field]: value },
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
      week.days.some(day => day.day === firstWorkoutDay?.day) // Match based on the day name
    );
    
    const weekNumber = weekIndex !== -1 ? weekIndex + 1 : null; // Convert to 1-based index
    

    const handleAddSet = async (exercise: Exercise) => {

      try {
        if (currentPlan && currentPlan.id && weekNumber !== null && firstWorkoutDay && exercise.id) {
          const newSetNumber = exercise.sets.length + 1;
          const newSet: SetDetails = {
            setNumber: newSetNumber,
            reps: 0,
            weight: 0,
            rir: 0,
          };
    
          const result = await addingSetToExercise({
            workoutId: currentPlan.id,
            weekNumber,
            day: firstWorkoutDay.day,
            exerciseId: exercise.id,
            newSet,
          });

          if (result.data && result.data.newSet.id) { // Check if the result and ID exist
            const newSetWithId = {
              ...newSet,
              id: result.data.newSet.id, // Add the returned ID
            };
    
    
          dispatch(
            addSetToExercise({
              weekNumber,
              day: firstWorkoutDay.day,
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
    console.log('is this thing working');
    console.log(set.id);
    console.log(weekNumber)
    console.log(currentPlan)
    console.log(currentPlan.id)
      try { 
        if (currentPlan && currentPlan.id && weekNumber !== null && firstWorkoutDay && exercise.id && set.id) {
          console.log("yeah boiii");
            await deleteSetFromExercise({
              workoutId: currentPlan.id,
              weekNumber,
              day: firstWorkoutDay.day,
              exerciseId: exercise.id,
              setId: set.id,
            });
            console.log("hmm whats going on");
            dispatch(
              removeSetFromExercise({
                weekNumber,
                day: firstWorkoutDay.day,
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
        firstWorkoutDay) {

        await deleteExerciseApi({
          workoutId: currentPlan.id,
          exerciseId: exercise.id,
          weekNumber,
          day: firstWorkoutDay.day
        }).unwrap();

        console.log('exercise deletion api call succeeded');

        dispatch(deleteExercise({
          weekNumber,
          day: firstWorkoutDay.day,
          exerciseId: exercise.id
        }))

      } else {
        console.warn('missing data required for exercise deletion');
      }

     
    } catch (error) {
      console.error('the try block did not execute:', error);
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
    {firstWorkoutDay ? (
      <div className="workout-card">
        <div className="workout-card-day-name-div">
          <h2>{firstWorkoutDay.day}</h2>
        </div>
        <ul>
        <ul>
  {firstWorkoutDay.exercises.length > 0 ? (
    firstWorkoutDay.exercises.map((exercise, exerciseIndex) => (
      <div key={exerciseIndex} className="exercise-card">
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
                  value={set.weight}
                  onChange={(e) =>
                    handleSetChange(exercise.id, set.id, "weight", Number(e.target.value))
                  }
                />
              </div>
              <div className="set-cell">
                <input
                  type="number"
                  value={set.reps}
                  onChange={(e) =>
                    handleSetChange(exercise.id, set.id, "reps", Number(e.target.value))
                  }
                />
              </div>
              <div className="set-cell">
                <input
                  type="number"
                  value={set.rir}
                  onChange={(e) =>
                    handleSetChange(exercise.id, set.id, "rir", Number(e.target.value))
                  }
                />
              </div>
            </div>
          ))}
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
</section>
        </>
    )
}

export default TodaysWorkoutPage;