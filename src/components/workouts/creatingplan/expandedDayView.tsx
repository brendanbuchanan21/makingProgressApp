import './submitworkoutpg.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { setPlanDuration, addWeek, addExerciseToDay, editExercise, deleteExercise, Exercise } from "../../../redux/workoutSlice";
import { DayPlan, WeekPlan } from "../../../redux/workoutSlice";
import { RootState } from "../../../redux/store";



const ExpandedDayView = ({ selectedDay, weekNumber, resetSelectedDay }: { selectedDay: string; weekNumber: number; resetSelectedDay: () => void }) => {
    const dispatch = useDispatch();

    const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);
      // Find the week that matches the weekNumber
  const week = currentPlan.weeks.find(week => week.weekNumber === weekNumber);

  // If the week is found, find the day and extract exercises
  const exercisesForDay = week?.days.find(day => day.day === selectedDay)?.exercises || [];
    const [exerciseName, setExerciseName] = useState('');
    const [muscleGroup, setMuscleGroup] = useState('Chest');
    const [sets, setSets] = useState(0);
    const [repsInReserve, setRepsInReserve] = useState(0);
    
    

    const handleBackDay = () => {
        resetSelectedDay(); // Reset the selected day in the parent component
    };


     // Handle adding exercise to store
     const handleAddExercise = () => {
        
        const newExercise: Exercise = {
            name: exerciseName,
            muscleGroup,
            sets,
            repsInReserve,
        };

        dispatch(
            addExerciseToDay({
                weekNumber,
                day: selectedDay,
                exercise: newExercise
            })
        );

        // Reset the form fields
        setExerciseName('');
        setMuscleGroup('Chest');
        setSets(0);
        setRepsInReserve(0);
        
        console.log('Selected Day:', selectedDay);  
        console.log('Week Number:', weekNumber); 
    };

     const handleDone = () => {
        resetSelectedDay();
    };
       


        return (
            <>
            <div className="overlay-for-submit-workout" />
           <div className="expanded-day-card">
               <h2>{selectedDay ? `${selectedDay} Exercises` : 'No day selected'}</h2>

               {/* Display existing exercises for this day */}
               <div className="exercise-list">
                   {exercisesForDay?.map((exercise, index) => (
                       <div key={index} className="exercise-item">
                           <div className="individual-exercise-description-div">
                           <p className="individual-exercise-name">{exercise.name}</p>
                           <p className="individual-exercise-muscle-group">{exercise.muscleGroup}</p>
                           <p className="individual-exercise-sets-and-rir">Sets: {exercise.sets}</p>
                           <p className="individual-exercise-sets-and-rir">RIR: {exercise.repsInReserve}</p>
                           </div>
                           <div className="individual-exercise-edit-btn-div">
                               <button>Edit</button>
                           </div>
                       </div>
                   ))}
               </div>

               {/* Add Exercise Form */}
               <div className="add-exercise-form">
                   <input type="text" placeholder="Exercise Name" id="exercise-name" value={exerciseName}  onChange={(e) => 
                    setExerciseName(e.target.value) 
                    }/>
                   <select id="muscle-group">
                       <option value="Chest">Chest</option>
                       <option value="Triceps">Triceps</option>
                       <option value="Biceps">Biceps</option>
                       <option value="Back">Back</option>
                       <option value="Shoulders">Shoulders</option>
                       <option value="Legs">Legs</option>
                   </select>

                   {/* Set Dropdown */}
                   <select
                       id="sets"
                       value={sets || ''}
                       onChange={(e) => setSets(Number(e.target.value))}
                   >
                       <option value="">Select Sets</option>
                       {[1, 2, 3, 4, 5].map((setValue) => (
                           <option key={setValue} value={setValue}>
                               {setValue}
                           </option>
                       ))}
                   </select>

                       {/* Reps and Reserve Choice Dropdown */}
                       <select
                       id="reps-and-reserve"
                       value={repsInReserve || ''}
                       onChange={(e) => setRepsInReserve(Number(e.target.value))}
                       >
                           <option value="">Select Reps & Reserve</option>
                           {[1, 2, 3, 4, 5].map((value) => (
                           <option key={value} value={value}>
                           {value}
                           </option>
                               ))}
                       </select>

                   {/* Button to go back and to add exercise */}
                   <div className="AE-btns-div">
                   <button onClick={handleBackDay}>&#x25c0; Back</button>
                   <button
                       onClick={handleAddExercise}
                       disabled={sets === 0 || repsInReserve === 0 || !exerciseName.trim()}
                   >
                       Add Exercise
                   </button>
                   <button onClick={handleDone}>Done</button>
                   </div>
                   
               </div>
           </div>
           </>
        )

}
export default ExpandedDayView;