// components/WorkoutTemplate.tsx
import '../../workouts/currentPlan/todaysWorkoutPage.css';
import NavBar from '../../dashboard/navbar';
import NoPlanWorkoutCard from './noPlanWorkoutCards';
import { useEffect, useState } from 'react';
import AddExerciseEntry from './addExerciseEntry';
import './noPlanWorkoutPase.css'
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const WorkoutTemplate = () => {

  //redux
  const quickWorkout = useSelector((state: RootState) => state.quickWorkout);

  //usestate
  const [exercises, setExercises] = useState(false);
  const [addingExercise, setAddingExercise] = useState(false);

const handleAddingExercise = () => {
  setAddingExercise(true);
}

  const Exercises = quickWorkout.quickWorkout.exercises;

useEffect(() => {
  if(Exercises.length >= 1) {
     setExercises(true);
     }
}, [Exercises])
    

  return (
    <>
  <NavBar />
  {exercises ? (
    <NoPlanWorkoutCard />
  ) : (
    <section className='empty-workout-section'>
        <div className='empty-workout-header-div'>
            <h1>Begin by adding an exercise</h1>
        </div>
        
        <div className='add-new-exercise-card' onClick={handleAddingExercise}>
            <p>add new exercise</p>
        </div>
    </section>
  )}
  {addingExercise && (
    <AddExerciseEntry setAddingExercise={setAddingExercise} />
  )}
</>
  );
};

export default WorkoutTemplate;
