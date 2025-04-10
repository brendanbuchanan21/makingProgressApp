import './workouts.css'
import '../../dashboard/dashboard.css'
import NavBar from '../../dashboard/navbar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../../redux/store';
import { useEffect, useState } from 'react';
import addMarkerBlue from '../../../images/addMarkerBlue.svg';

const WorkoutSection = () => {

  const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);

  const firstIncompleteWorkout = currentPlan?.weeks
  .flatMap((week, index) => week.days.map((day) => ({ ...day, weekNumber: index + 1 }))) // Attach weekNumber to each day
  .find((day) => !day.isCompleted); // Find the first incomplete day

  const weekNumber = firstIncompleteWorkout?.weekNumber;
  const numberOfExercises = firstIncompleteWorkout?.exercises.length;
  const uniqueMuscleGroups = [...new Set(firstIncompleteWorkout?.exercises.map((exercise) => exercise.muscleGroup))];
  const currentDay = firstIncompleteWorkout?.day;

  const [noPlan, setNoPlan] = useState(false);
  const [planIsComplete, setPlanIsComplete] = useState(false)
  const [isCurrentPlan, setIsCurrentPlan] = useState(false);
  const [showPlanMessage, setShowPlanMessage] = useState(false);
   
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

const handleClosePopUp = () => {
        setShowPlanMessage(false)
       return 
}

    
return (
    <>
    <NavBar />
    <section className='WP-section-1'>
        <div className='WP-header-div'>
        <h1>Workout page</h1>
        </div>

        <div className='WP-cards-container'>
            <div className='WP-card' id='WP-card-past-plans'>
            <p className='WP-card-text' id='WP-card-text-past-plans'>Plans & Past Workouts</p>
                <Link to="/currentPlanPage" id='WP-past-plans-view-btn'>
                    <p>View</p>
                </Link>
            </div>

            <div id='WP-card'>
    <p className='WP-card-text'>Start Workout</p>
    {noPlan ? (
        <div className='WP-current-workout-card'>
            <h2>Jump into a quick workout</h2>
        </div>
    ) : planIsComplete ? ( // Corrected nested ternary
        <div className='WP-current-workout-card'>
            <p>Navigate to the plans page to submit a Plan</p>
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
                <p>Begin Workout</p>
            </button>
        ) : (
            <Link to='/todaysWorkoutPage' className='WP-card-btn'>
                <p>Begin Workout</p>
            </Link>
        )}
</div>


            <div className="WP-card" id='WP-card-new-plan'>
            <p className="WP-card-text" id='WP-new-plan-text'>New Plan</p>
            {isCurrentPlan ? (
                <button 
                className="add-new-plan-btn" 
                onClick={() => setShowPlanMessage(true)}
                >
                <img src={addMarkerBlue} alt="Add" className="add-icon" />
                <span>Add</span>
                </button>
            ) : (
                <Link to="/newPlanPopup" className="add-new-plan-btn">
                <img src={addMarkerBlue} alt="Add" className="add-icon" />
                <span>Add</span>
                </Link>
            )}
            </div>


            
            {showPlanMessage && (
                <>
                <div className="WP-overlay">
                    <div className="WP-modal">
                        <p>You can't create a new plan while one is active!</p>
                            <button onClick={handleClosePopUp} className="WP-modal-close-btn">Close</button>
                    </div>
                </div>
                </>
            )}
        </div>
    </section>
   
    </>
);




}

export default WorkoutSection;