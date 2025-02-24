import './submitworkoutpg.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from "react";
import { addWeek, addExerciseToDay, editExercise, deleteExercise, Exercise } from "../../../redux/workoutSlice";
import { DayPlan, WeekPlan } from "../../../redux/workoutSlice";
import { RootState } from "../../../redux/store";
import EditExercisePopup from './editExercisePopUp';
import { useAddingExerciseToDayMutation, useDeleteExerciseApiMutation, useEditExerciseApiMutation } from '../../../redux/workoutApi';

const ExpandedDayView = ({
    selectedDay,
    weekNumber,
    resetSelectedDay,
  }: {
    selectedDay: DayPlan;
    weekNumber: number;
    resetSelectedDay: () => void;
  }) => {
    const dispatch = useDispatch();

    const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);
      // Find the week that matches the weekNumber
  const week = currentPlan.weeks.find(week => week.weekNumber === weekNumber);

  console.log(currentPlan);
  // If the week is found, find the day and extract exercises
    const exercisesForDay = week?.days.find((day) => day.day === selectedDay.day)?.exercises || [];
    const [exerciseName, setExerciseName] = useState('');
    const [muscleGroup, setMuscleGroup] = useState('Chest');
    const [sets, setSets] = useState(0);
    const [repsInReserve, setRepsInReserve] = useState(0);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const workoutId = currentPlan?.id ?? "";
    // api functions
    const [addingExerciseToDay] = useAddingExerciseToDayMutation();
    const [deleteExerciseApi] = useDeleteExerciseApiMutation();
    const [editExerciseApi] = useEditExerciseApiMutation();

    const handleBackDay = () => {
        resetSelectedDay(); // Reset the selected day in the parent component
    };


     // Handle adding exercise to store
     const handleAddExercise = async () => {
        if (!currentPlan.id) {
            console.error("Workout ID is missing!");
            return;
        }
       

        const newExercise: Exercise = {
            name: exerciseName,
            muscleGroup,
            sets,
            repsInReserve,
        };

        try {

            const response = await addingExerciseToDay({
                id: workoutId,
                weekNumber,
                day: selectedDay.day,
               exercise: newExercise
            }).unwrap();

            const exerciseWithId: Exercise = { ...newExercise, id: response._id };

          
            dispatch(
                addExerciseToDay({
                    weekNumber,
                    day: selectedDay.day,
                    exercise: exerciseWithId
                })
            );
             // Reset the form fields
            setExerciseName('');
            setMuscleGroup('Chest');
            setSets(0);
            setRepsInReserve(0);
    
        } catch (error) {
            console.error("failed to add exercise:", error);
        }
      
       
    };

     
    const handleSaveExercise = async (updatedExercise: Exercise) => {
        // Dispatch an action to save the updated exercise

        if(!selectedExercise?.id) {
            console.error("Exercise Id is missing");
            return;
        }

        const exerciseId = selectedExercise.id;

        

        try {
            const response = await editExerciseApi({
                workoutId,
                weekNumber,
                day: selectedDay.day,
                exerciseId,
                updatedExercise
            }).unwrap()

            console.log('exercise submitted to backend:', response);

            dispatch(
                editExercise({
                  weekNumber,
                  day: selectedDay.day,
                  exerciseId,
                  updatedExercise,
                })
              );
              setShowEditPopup(false); // Close the popup after saving

        } catch (error) {
            console.error("not able to update exercise", error);
        }

       
      };
       
      const handleDeleteExercise = async (exerciseId: string) => {
        if (window.confirm("Are you sure you want to delete this exercise?")) {

            try {

                const response = await deleteExerciseApi({
                    workoutId,
                    exerciseId,
                    weekNumber,
                    day: selectedDay.day
                }).unwrap()
                console.log('exercise deleted successfully', response);

                    dispatch(
                        deleteExercise({
                            weekNumber,
                            day: selectedDay.day,
                            exerciseId,
                        })
                    );
            
            } catch (error) {
                console.error('failed to delete the exercise from db:', error);
            }

           
      }
    }


      return (
    
        <>
        {showEditPopup && selectedExercise ? (
            <EditExercisePopup
                exercise={selectedExercise}
                onClose={() => setShowEditPopup(false)}
                onSave={handleSaveExercise}
            />
        ) : (
            <>
                <div className="overlay-for-submit-workout" />
                <div className="expanded-day-card">
                    <h2>{selectedDay.day} Exercises</h2>
                    <div className="exercise-list">
                        {exercisesForDay?.map((exercise) => (
                            <div key={exercise.id} className="exercise-item">
                                <div className="individual-exercise-description-div">
                                    <p className="individual-exercise-name">{exercise.name}</p>
                                    <p className="individual-exercise-muscle-group">{exercise.muscleGroup}</p>
                                    <p className="individual-exercise-sets-and-rir">
                                        Sets: {exercise.sets}
                                    </p>
                                    <p className="individual-exercise-sets-and-rir">
                                        RIR: {exercise.repsInReserve}
                                    </p>
                                </div>
                                <div className="individual-exercise-edit-btn-div">
                                    <button
                                        onClick={() => {
                                            setSelectedExercise(exercise);
                                            setShowEditPopup(true);
                                        }}
                                    >
                                 <svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#white" ><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                                    </button>
                                    <button onClick={() => {
                                        console.log(exercise)
                                        if (exercise.id) {
                                            handleDeleteExercise(exercise.id);  // Only call if id is defined
                                        } else {
                                            console.error("Exercise ID is missing or undefined.");
                                        }
                                    }}>X</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="add-exercise-form">
                        <input
                            type="text"
                            placeholder="Exercise Name"
                            id="exercise-name"
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                        />
                        <select
                            id="muscle-group"
                            value={muscleGroup}
                            onChange={(e) => setMuscleGroup(e.target.value)}
                        >
                            <option value="Chest">Chest</option>
                            <option value="Triceps">Triceps</option>
                            <option value="Biceps">Biceps</option>
                            <option value="Back">Back</option>
                            <option value="Shoulders">Shoulders</option>
                            <option value="Legs">Legs</option>
                        </select>
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
                        <div className="AE-btns-div">
                            <button onClick={handleBackDay}>&#x25c0; Back</button>
                            <button
                                onClick={handleAddExercise}
                                disabled={sets === 0 || repsInReserve === 0 || !exerciseName.trim()}
                            >
                                Add Exercise
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )}
    </>
          
      );
      
}
export default ExpandedDayView;