import './workouts.css'
import '../../dashboard/dashboard.css'
import NavBar from '../../dashboard/navbar';
import { useSelector, UseSelector } from 'react-redux';
import planningImg from '../../../images/planningImg.jpg'
import currentPlanImg from '../../../images/currentPlanImg.jpeg'
import { Link } from 'react-router-dom';
import { RootState } from '../../../redux/store';
 

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


return (
    <>
    <NavBar />
    <section className='WP-section-1'>
        <div className='WP-header-div'>
        <h1>Workouts</h1>
        </div>

        <div className='WP-cards-container'>
            <div className='WP-card'>
            <p className='WP-card-text'>Current Plan</p>
                <img src={currentPlanImg} className='WP-current-plan-card' />
                <Link to='/currentPlanPage' className='WP-card-btn'>
                <p>let's go</p>
                </Link>
            </div>

            <div className='WP-card'>
                <p className='WP-card-text'>Start Workout</p>
                <div className='WP-current-workout-card'>
                    <h2>Upcoming Workout🏋️‍♀️</h2>
                    <p>Week:{weekNumber}</p>
                    <p>{currentDay}</p>
                    <p>{numberOfExercises} exercises</p>
                    <p>Muscle groups: <span className='muscle-group-preview-text'>{uniqueMuscleGroups.join(', ')}</span></p>
                </div>
                <Link to='/todaysWorkoutPage' className='WP-card-btn'>
                <p>let's go</p>
                </Link>
            </div>

            <div className='WP-card'>
                <p className='WP-card-text'>New Plan</p>
                    <img src={planningImg} alt="" className='WP-new-plan-card' />
                <Link to='/newPlanPopup' className='WP-card-btn'>
                <p>let's go</p>
                </Link>
            </div>
        </div>
    </section>
   
    </>
);




}

export default WorkoutSection;