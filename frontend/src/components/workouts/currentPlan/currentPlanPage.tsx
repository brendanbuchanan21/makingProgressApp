
import './currentPlanPage.css'
import WeekCard from "./weekCard";
import NavBar from "../../dashboard/navbar";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import addMarkerBlue from '../../../images/addMarkerBlue.svg'
import { useDispatch, useSelector } from 'react-redux';
import { addWeek } from '../../../redux/workoutSlice';
import { RootState } from '../../../redux/store';
import { useHandleAddWeekApiMutation } from '../../../redux/workoutApi';
import { resetWorkoutState } from '../../../redux/workoutSlice';
import { usePostCompletedProgramMutation, useGetCompletedProgramQuery  } from '../../../redux/completedProgramsApi';
import { useDeleteExerciseProgramMutation } from '../../../redux/workoutApi';
import dumbbellImg from '../../../images/dumbbell-svgrepo-com.svg';
import { ClipLoader } from 'react-spinners';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useGetNoPlanWorkoutsQuery } from '../../../redux/noPlanWorkoutApi';


const CurrentPlanPage = () => {

    const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //use state and rtk queries
    const [isEditing, setIsEditing] = useState(false);
    const [addWeekApi] = useHandleAddWeekApiMutation();
    const [postCompletedProgram] = usePostCompletedProgramMutation();
    const [isUserReady, setIsUserReady] = useState(false);
    const [userId, setUserId] = useState<string | null>(null)
    const [noPlan, setNoPlan] = useState(false);
    const [selectedTab, setSelectedTab] = useState<"plans" | "quickWorkouts">("plans");


    
    const [deleteExerciseProgram] = useDeleteExerciseProgramMutation();

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

    // retrieve all past plans
    const { data: completedPrograms, error, isLoading } = useGetCompletedProgramQuery(undefined, {
        skip: !isUserReady,
        refetchOnMountOrArgChange: true
    });

    console.log({completedPrograms}, 'what does this look like?');
    //if all days in plan have iscomplete then set programComplete to true 
    const allDaysComplete = currentPlan?.weeks?.every(week => 
        week.days.every(day => day.isCompleted)
    ) ?? false

    const programComplete = allDaysComplete;

   const editMode = () => {
        setIsEditing(!isEditing);
   }

    const handleResetState = () => {
           dispatch(resetWorkoutState());
       }

       useEffect(() => {
        if(!currentPlan || !currentPlan._id) {
            setNoPlan(true);
        } else {
            setNoPlan(false);
        }
    }, [currentPlan]);

   const handleAddWeek = async () => {
        
        try{
            if(!currentPlan) {
                return;
            }
            const lastWeekNumber = currentPlan.weeks.length > 0 ? currentPlan.weeks[currentPlan.weeks.length - 1].weekNumber : 0;

            const newWeekNumber = lastWeekNumber + 1;

            // Get the first week's days and reset the 'isCompleted' status
            const daysForNewWeek = currentPlan.weeks.length > 0
            ? currentPlan.weeks[0].days.map(day => ({
                day: day.day,
                exercises: day.exercises.map(exercise => ({
                    id: exercise._id,
                    name: exercise.name,
                    muscleGroup: exercise.muscleGroup,
                    sets: exercise.sets.map((_, index) => ({
                        setNumber: index + 1, // Ensures setNumber starts from 1
                        reps: null,
                        weight: null,
                        rir: null
                    }))
                }))
            }))
            : [];

            const response = await addWeekApi({
                workoutPlanId: currentPlan._id,
                weekNumber: newWeekNumber,
                days: daysForNewWeek
            }).unwrap();

            const newWeek = response.weeks.find(week => week.weekNumber === newWeekNumber)
            if(!newWeek) {
                console.error('new week not found in response');
            }

            console.log(newWeek, 'this is the new week from response')
            console.log(response, 'funny march day bruh');
            dispatch(addWeek({workoutPlanId: currentPlan._id, newWeek}))
        } catch (error) {
            console.error(error);
        }
   }


   const handleSubmitPlan = async () => {


          
    const completedPlan = {
      workoutPlanId: currentPlan._id,
      name: currentPlan.name ?? "Untitled Program",
      startDate: currentPlan.startDate,
      duration: currentPlan.duration
    }
    
    console.log('please run function,', completedPlan);
    try {
        const response = await postCompletedProgram(completedPlan).unwrap()
        console.log('completed program response:', response);

        navigate('/workouts');
       

      } catch (error) {
        console.error('error posting completed program:', error);
      }

     try {
        console.log(completedPlan.workoutPlanId, 'should work, right? ');
        const deleteCurrentPlan = await deleteExerciseProgram({ id: completedPlan.workoutPlanId }).unwrap()
        console.log(deleteCurrentPlan, 'this is the response from deleting workout plan');
        dispatch(resetWorkoutState());

     } catch (error) {
        console.error('error caught before making query:', error);
     }
  }

   // Fetch quick workout data
   const { data: quickWorkouts, error: quickWorkoutsError, isLoading: quickWorkoutsLoading} = useGetNoPlanWorkoutsQuery(undefined, {
        skip: !isUserReady,
        refetchOnMountOrArgChange: true,
    });

    console.log(quickWorkouts, 'investigate')

    const handleTabSwitch = (tab: "plans" | "quickWorkouts") => {
        if(selectedTab !== tab) {
            setSelectedTab(tab);
        }
    }


    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }).replace(",", " at"); // Formats date properly
    };

    return (
        <>
            <section className={noPlan ? "currentPlanPageNoPlan" : "currentPlanPage"}>
                <NavBar />
                {noPlan ? (
                    <p className='no-current-plan-text'>No current Plan</p>
                ) : (
                    <>
                        <button onClick={() => dispatch(resetWorkoutState())}>Reset</button>
                        <div className="currentPlanPage-header-div">
                            <h1>Current Plan</h1>
                        </div>
                        <div className="currentPlanPage-edit-plan-btn-div">
                            <Link to="/workouts" className="currentPlanPage-back-btn">Back</Link>
                            <button className="currentPlanPage-edit-btn" onClick={() => setIsEditing(!isEditing)}>Edit Plan</button>
                        </div>
                        <div className="grid-container">
                            <WeekCard isEditing={isEditing} />
                        </div>
                        {isEditing && (
                            <div className='add-week-marker-div'>
                                <div className='add-week-marker-wrapper' onClick={() => {}}>
                                    <img src={addMarkerBlue} alt="Add Week" />
                                    <p>Add Week</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* TABS */}
            <section className='previous-plans-section'>
                <div className='previous-plans-header-div'>
                    <h1>Previous Plans</h1>
                </div>
                <div className='previous-plans-or-quick-workout-select-div'>
                    <p className={selectedTab === "plans" ? "active-tab" : ""} onClick={() => handleTabSwitch("plans")}>Previous Plans</p>
                    <p className={selectedTab === "quickWorkouts" ? "active-tab" : ""} onClick={() => handleTabSwitch("quickWorkouts")}>Previous Quick Workouts</p>
                </div>

                {/* RENDER BASED ON TAB SELECTION */}
                {selectedTab === "plans" ? (
                    isLoading ? (
                        <div className='spinner-container'>
                            <ClipLoader size={50} color='#007bff' />
                        </div>
                    ) : error ? (
                        <p>Error loading previous plans. Please try again.</p>
                    ) : completedPrograms?.completedPrograms?.length > 0 ? (
                        <div className='grid-container-2'>
                            {completedPrograms.completedPrograms.map((program: any) => (
                                <div className='previous-plan-card' key={program._id}>
                                    <h3><u>{program.name}</u></h3>
                                    <p>Plan completed from: {program.startDate} - {program.endDate}</p>
                                    <p>Lasted: {program.duration}</p>
                                    <p>Total Volume: {program.totalVolume} lbs <span><img src={dumbbellImg} alt="" className='span-dumbbell'/></span></p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className='previous-plans-text'>No Previous Plans Found</p>
                    )
                ) : (
                    // RENDER QUICK WORKOUTS
                    quickWorkoutsLoading ? (
                        <div className='spinner-container'>
                            <ClipLoader size={50} color='#007bff' />
                        </div>
                    ) : quickWorkoutsError ? (
                        <p>Error loading quick workouts. Please try again.</p>
                    ) : quickWorkouts?.length > 0 ? (
                        <div className='grid-container-2'>
                            {quickWorkouts.map((workout: any) => (
                                <div className='quick-workout-card' key={workout._id}>
                                    <h3><u>Past Workout</u></h3>
                                    <p>Completed on: {formatDate(workout.dateDone)}</p>
                                    {Array.isArray(workout.exercises) ? (
                                        workout.exercises.map((exercise: any) => (
                                            <p key={exercise._id}>Muscle Groups: <span className='quick-workout-card-muscle-group'>{exercise.muscleGroup}</span></p>
                                        ))
                                    ) : (
                                        <p>No exercises found</p>
                                    )}
                                    <p>Total Volume: {workout.totalVolume} lbs</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No Quick Workouts Found</p>
                    )
                )}
            </section>
        </>
    );



}
export default CurrentPlanPage;
