import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../redux/store";
import { useGetCompletedWorkoutVolumeQuery } from "../../../redux/completedWorkoutApi";
import dumbbellIcon  from '../../../images/dumbbell-svgrepo-com.svg';
import deleteMarker from '../../../images/deleteMarker.svg';
import { deleteWeek, setCurrentPlan } from "../../../redux/workoutSlice";
import './currentPlanPage.css'
import { useDeleteWeekApiMutation } from "../../../redux/workoutApi";
import { useGetExerciseProgramQuery } from "../../../redux/workoutApi";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";




interface WeekCardProps {
    isEditing: boolean;
}


const WeekCard: React.FC<WeekCardProps> = ({ isEditing }) => {

    

    const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);
    const weeks = currentPlan?.weeks ?? [];
    const workoutPlanId = currentPlan?._id;
    const [isUserReady, setIsUserReady] = useState(false);
    const [userId, setUserId] = useState<string | null>(null)
   

    const dispatch = useDispatch();
    

     const auth = getAuth();
        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if(user) {
                    setUserId(user.uid);
                    setIsUserReady(true)
                } else {
                    setUserId(null);
                    setIsUserReady(false);
                }
            });
            //clean up on unmount
            return () => unsubscribe();
        }, [auth]);

  // Ensure the query is only sent when the token is ready
  const { data: workoutPlanData, error: workoutPlanError, isLoading: isLoadingWorkoutPlan } = useGetExerciseProgramQuery(
    { workoutPlanId: workoutPlanId },
    {
      skip: !isUserReady,
      refetchOnMountOrArgChange: true,
    }
    
  );
    
    
    
  // Second query: Get completed workout volume
  const { data: completedWorkoutData, error: completedWorkoutsError, isLoading: isLoadingCompletedWorkouts } = useGetCompletedWorkoutVolumeQuery(
    workoutPlanId,
    {
      skip: !isUserReady, // Ensure it doesn't run until the user is ready
    refetchOnMountOrArgChange: true, // Ensure it refetches if workoutPlanId changes
    }
  );

   

    useEffect(() => {
      if(workoutPlanData && !currentPlan) {
        dispatch(setCurrentPlan(workoutPlanData));
      }
    }, [workoutPlanData, dispatch, currentPlan])
    // Fetch completed workouts for the plan

    
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
    
  


    // work on adding functionality to the delete marker on each card
    const handleDeleteWeek = async (weekNumber: number) => {
       const weekToDelete = weeks.find((w) => w.weekNumber === weekNumber);

       const someCompletedWorkouts = weekToDelete?.days.some(d => d.isCompleted);

       if(someCompletedWorkouts) {
        window.alert('you cannot delete a week with completed workouts');
        return;
       }

      if(window.confirm('are you sure you want to delete this week?')) {
      
        try {
          
        await deleteWeekApi({
            workoutPlanId: workoutPlanId,
            weekNumber: weekNumber
          })

          dispatch(deleteWeek(weekNumber));

        } catch (error) {
          console.error('could not complete request to delete week', error);
        }
      
      }

    }
    
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
                            handleDeleteWeek(week.weekNumber);
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
      </>
    );
  };
  


export default WeekCard;