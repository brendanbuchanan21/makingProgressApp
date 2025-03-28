import './workouts.css'
import '../../dashboard/dashboard.css'
import NavBar from '../../dashboard/navbar';
import { useSelector, UseSelector } from 'react-redux';
import planningImg from '../../../images/planningImg.jpg'
import currentPlanImg from '../../../images/currentPlanImg.jpeg'
import { Link } from 'react-router-dom';
import { RootState } from '../../../redux/store';
import { useEffect, useState } from 'react';

const WorkoutSection = () => {

    const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);

    const firstIncompleteWorkout = currentPlan?.weeks
  .flatMap((week, index) => week.days.map((day) => ({ ...day, weekNumber: index + 1 }))) // Attach weekNumber to each day
  .find((day) => !day.isCompleted); // Find the first incomplete day

    console.log(firstIncompleteWorkout);
    const weekNumber = firstIncompleteWorkout?.weekNumber;
    const numberOfExercises = firstIncompleteWorkout?.exercises.length;
    const uniqueMuscleGroups = [...new Set(firstIncompleteWorkout?.exercises.map((exercise) => exercise.muscleGroup))];
    const currentDay = firstIncompleteWorkout?.day;

    const [noPlan, setNoPlan] = useState(false);
    const [planIsComplete, setPlanIsComplete] = useState(false)
    const [isCurrentPlan, setIsCurrentPlan] = useState(false);
   
    useEffect(() => {
        if(!currentPlan || !currentPlan._id) {
            setNoPlan(true);
        } else {
            setNoPlan(false);
        }
    }, [currentPlan]);

    
    useEffect(() => {
        if (currentPlan && currentPlan.weeks) {
            if (currentPlan.weeks.length === 0) {
                setPlanIsComplete(false); // Explicitly set to false for empty weeks array
            } else {
                const allDaysComplete = currentPlan.weeks.every((week) =>
                    week.days.every((day) => day.isCompleted)
                );
                console.log(allDaysComplete, 'huh');
                setPlanIsComplete(allDaysComplete);
            }
        } else {
            setPlanIsComplete(false);
        }
    }, [currentPlan]);


    useEffect(() => {
        if(currentPlan && currentPlan.weeks.length > 0) {
            setIsCurrentPlan(true)
        } else {
            setIsCurrentPlan(false);
        }
    }, [currentPlan])

    const handleAlertMessage = () => {

       return window.alert('you can not make a plan while one is in motion');
    }

    
return (
    <>
    <NavBar />
    <section className='WP-section-1'>
        <div className='WP-header-div'>
        <h1>Workouts</h1>
        </div>

        <div className='WP-cards-container'>
            <div className='WP-card'>
            <p className='WP-card-text'>Workout Plans</p>
              <img src={currentPlanImg} className='WP-current-plan-card' />
              {noPlan ? (
                <button onClick={() => alert('create a plan to view a plan!')} className='WP-card-btn'>
                    <p>View Plans</p>
                </button>
            ) : (
                <Link to="/currentPlanPage" className="WP-card-btn">
                    <p>Let's go</p>
                </Link>
            )}
            </div>

            <div className='WP-card'>
    <p className='WP-card-text'>Start Workout</p>
    {noPlan ? (
        <div className='WP-current-workout-card'>
            <h2>Jump into a quick workout</h2>
        </div>
    ) : planIsComplete ? ( // Corrected nested ternary
        <div className='WP-current-workout-card'>
            <p>Navigate to Current Plan page to submit Plan</p>
        </div>
    ) : (
        <div className='WP-current-workout-card'>
            <h2>Upcoming Workout🏋️‍♀️</h2>
            <p>Week: {weekNumber}</p>
            <p>{currentDay}</p>
            <p>{numberOfExercises} exercises</p>
            <p>Muscle groups: <span className='muscle-group-preview-text'>{uniqueMuscleGroups.join(', ')}</span></p>
        </div>
    )}

    {noPlan ? (
            <Link to='/quickWorkoutPage' className='WP-card-btn'>
                <p>Begin Workout</p>
            </Link>
        ) : planIsComplete ? (
            <button onClick={() => alert('Create a plan to view a plan!')} className='WP-card-btn'>
                <p>Let's go</p>
            </button>
        ) : (
            <Link to='/todaysWorkoutPage' className='WP-card-btn'>
                <p>Let's go</p>
            </Link>
        )}
</div>


               
               
              

            <div className='WP-card'>
                <p className='WP-card-text'>New Plan</p>
                    <img src={planningImg} alt="" className='WP-new-plan-card' />
                    {isCurrentPlan ? (
                        <p onClick={handleAlertMessage} className='WP-card-btn'>Let's go</p>
                    ) : (
                        <Link to='/newPlanPopup' className='WP-card-btn'>
                <p>Let's go</p>
                </Link>
                    )}
                
            </div>
        </div>
    </section>
   
    </>
);




}

export default WorkoutSection;