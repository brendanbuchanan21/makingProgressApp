import { useState } from "react";
import './editExercisePopup.css';
import { SetDetails } from "../../../redux/workoutSlice";


interface EditExercisePopupProps {
    exercise: {
        name: string;
        muscleGroup: string;
        sets: SetDetails[];
    };
    onSave: (updatedExercise: {
        name: string;
        muscleGroup: string;
        sets: SetDetails[];
    }) => void;
    onClose: () => void;
}

const EditExercisePopup: React.FC<EditExercisePopupProps> = ({ exercise, onSave, onClose }) => {
    // now we need to set local state to change the exercise
    const [name, setName] = useState(exercise.name);
    const [muscleGroup, setMuscleGroup] = useState(exercise.muscleGroup);
    const [sets, setSets] = useState(exercise.sets);

    

    const handleSave = () => {
        const updatedExercise = {
            name, 
            muscleGroup,
            sets,
        };
        onSave(updatedExercise);
    }

    const handleNumberOfSetsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSetCount = Number(e.target.value);
        const updatedSets = Array.from({ length: newSetCount }, (_, index) => ({
            setNumber: index + 1,
            reps: 0,  // Default value, you can adjust as needed
            weight: 0,  // Default value
            rir: 0,  // Default value
        }));

        setSets(updatedSets); // Update the sets array with the new set count
    };



    return (
        <>
        <div className="overlay-for-submit-workout" />
        <div className="edit-exercise-popup">
        <p>Edit Exercise</p>
          <input value={name} onChange={(e) => setName(e.target.value)} className="edit-exercise-popup-input"/>
          <input value={muscleGroup} onChange={(e) => setMuscleGroup(e.target.value)} className="edit-exercise-popup-input" />
          <input value={sets.length} onChange={handleNumberOfSetsChange} className="edit-exercise-popup-input" />
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
        </>
      );


}

export default EditExercisePopup;