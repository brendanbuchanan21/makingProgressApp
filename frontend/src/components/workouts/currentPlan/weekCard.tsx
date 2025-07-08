import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../redux/store";
import { useGetCompletedWorkoutVolumeQuery } from "../../../redux/completedWorkoutApi";
import dumbbellIcon  from '../../../images/dumbbell-svgrepo-com.svg';
import deleteMarker from '../../../images/deleteMarker.svg';
import { deleteWeek } from "../../../redux/workoutSlice";
import './currentPlanPage.css'
import { useDeleteWeekApiMutation } from "../../../redux/workoutApi";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import React from "react";




interface WeekCardProps {
    isEditing: boolean;
}


const WeekCard: React.FC<WeekCardProps> = ({ isEditing }) => {

    
  //redux state
  const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);
  console.log('current plan, 🥎', currentPlan);
  const weeks = currentPlan?.weeks ?? [];
  const workoutPlanId = currentPlan?._id;


  //use state values
  const [isUserReady, setIsUserReady] = useState(false);
  const [warningMessage, setWarningMessage] = useState(false);
  const [deleteWeekPopUp, setDeleteWeekPopUp] = useState(false);
  const [weekToDelete, setWeekToDelete] = useState<number | null>(null);
   
  //imported necessities
  const dispatch = useDispatch();
  const auth = getAuth();


useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
  if(user) {
  setIsUserReady(true)
  } else {
  setIsUserReady(false);
  }
  });
  //clean up on unmount
  return () => unsubscribe();
}, [auth]);

/*
  // Ensure the query is only sent when the token is ready
  const { data: workoutPlanData } = useGetExerciseProgramQuery(
  { workoutPlanId: workoutPlanId },
  {
  skip: !isUserReady,
  refetchOnMountOrArgChange: true,
  });
*/
    
  // Second query: Get completed workout volume
  const { data: completedWorkoutData } = useGetCompletedWorkoutVolumeQuery(
  workoutPlanId,
  {
  skip: !isUserReady, // Ensure it doesn't run until the user is ready
  refetchOnMountOrArgChange: true, // Ensure it refetches if workoutPlanId changes
  }
  );

/*
useEffect(() => {
  if(workoutPlanData && !currentPlan) {
  dispatch(setCurrentPlan(workoutPlanData));
  }
}, [workoutPlanData, dispatch, currentPlan])
    // Fetch completed workouts for the plan

    */
    
  const [deleteWeekApi] = useDeleteWeekApiMutation();
    
  // Group the completed workouts by weekNumber and sum totalVolume for each week
  let volumeByWeek: { [key: number]: number } = {};

  // Group the completed workouts by weekNumber and sum totalVolume for each week
  if (Array.isArray(completedWorkoutData)) {
  volumeByWeek = completedWorkoutData.reduce((acc: { [key: number]: number }, workout: any) => {
  const weekNum = workout.weekNumber;
  
  // Only initialize week number if it doesn't already have a value
  if (acc[weekNum] === undefined) {
  acc[weekNum] = 0;
  }
  
  // Add the workout volume to the week
  acc[weekNum] += workout.totalVolume;
  return acc;
  }, {});
  }
    



const checkIfWeekInProgress = (weekNumber: number | null) => {

  const weekToDelete = weeks.find((w) => w.weekNumber === weekNumber);
  const someCompletedWorkouts = weekToDelete?.days.some(d => d.isCompleted);

  if (someCompletedWorkouts) {
    setWarningMessage(true);
    return;
  }

  setWeekToDelete(weekNumber)
  setDeleteWeekPopUp(true);
}

 

const handleDeleteWeek = async (weekToDelete: number | null) => {
  if (weekToDelete === null || !workoutPlanId) return;
  
  try {
    await deleteWeekApi({ workoutPlanId, weekNumber: weekToDelete });
    dispatch(deleteWeek(weekToDelete));
  } catch (error) {
    console.error('Could not delete week:', error);
  } finally {
    setDeleteWeekPopUp(false);
    setWeekToDelete(null);
  }
};
  

  


    
    return (
      <>
        {weeks.map((week, index) => {
          const weekVolume = volumeByWeek[week.weekNumber] || 0;
          const isWeekCompleted = week.days.every(day => day.isCompleted);
    
          return (
            <div className="week-card-div" key={index}>
                {isEditing && (
                    <div className="week-card-delete-marker-div">
                        <img src={deleteMarker} alt="" className="week-card-delete-marker" onClick={() => {
                         checkIfWeekInProgress(week.weekNumber);
                        }}/>
                    </div>
                )}
              <div className="week-card-head-text-div">
                <h3>Week {week.weekNumber}</h3>
                <p>{isWeekCompleted ? 'Completed ✅' : 'In Progress'}</p>
                {isWeekCompleted && (
                  <p className="week-card-volume">Total Volume: {weekVolume} lbs <img src={dumbbellIcon} alt="" className="dumbbell-icon"/></p>
                )}
              </div>
              <div className="week-card-exercises-div">
                <p className="week-card-exercise-text">Exercises:</p>
                {week.days.map((day, dayIndex) => (
                  <p key={dayIndex} className="exercise-in-week-card-text">
                    <strong>{day.day}:</strong>{' '}
                    {day.exercises && day.exercises.length > 0
                      ? day.exercises.map((exercise, exIndex) => (
                          <span key={exIndex}>
                            {exercise.name}
                            {exIndex !== day.exercises.length - 1 ? ', ' : ''}
                          </span>
                        ))
                      : 'No exercises'}
                  </p>
                ))}
              </div>
            
            </div>
            
          );
        })}
          {warningMessage && (
              <div className="custom-modal-overlay">
    <div className="custom-modal-content">
      <h2 className="custom-modal-title">Action Not Allowed</h2>
      <p className="custom-modal-message">
        You cannot delete a week with completed workouts.
      </p>
      <div className="custom-modal-buttons">
        <button
          className="cancel-btn"
          onClick={() => { 
            setWarningMessage(false);
            setWeekToDelete(null);
         }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
            )}
            {deleteWeekPopUp && (
               <div className="custom-modal-overlay">
               <div className="custom-modal-content">
                 <h2 className="custom-modal-title">Delete Week</h2>
                 <p className="custom-modal-message">
                   Are you sure you want to delete this week from your plan?
                 </p>
                 <div className="custom-modal-buttons">
                   <button
                     className="confirm-btn"
                     onClick={() => handleDeleteWeek(weekToDelete)}
                   >
                     Yes, delete
                   </button>
                   <button
                     className="cancel-btn"
                     onClick={() => {
                      setDeleteWeekPopUp(false);
                      setWeekToDelete(null);
                     }
                     }
                   >
                     Cancel
                   </button>
                 </div>
               </div>
             </div>
            )}
      </>
    );
  };
  


export default React.memo(WeekCard);