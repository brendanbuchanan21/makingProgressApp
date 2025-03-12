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

    const handleNumberOfSetsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSetCount = Number(e.target.value);
        const updatedSets = Array.from({ length: newSetCount }, (_, index) => ({
            setNumber: index + 1,
            reps: null,  
            weight: null,  
            rir: null,  
        }));

        setSets(updatedSets); // Update the sets array with the new set count
    };



    return (
        <>
        <div className="overlay-for-submit-workout" />
        <div className="edit-exercise-popup">
        <p>Edit Exercise</p>
          <input value={name} onChange={(e) => setName(e.target.value)} className="edit-exercise-popup-input"/>
          <select value={muscleGroup} onChange={(e) => setMuscleGroup(e.target.value)}>
            <option value="Chest">Chest</option>
            <option value="Triceps">Triceps</option>
            <option value="Biceps">Biceps</option>
            <option value="Back">Back</option>
            <option value="Shoulders">Shoulders</option>
            <option value="Legs">Legs</option>
            <option value="Abs">Abs</option>
            <option value="Calves">Calves</option>
          </select>
          <select value={sets.length} onChange={handleNumberOfSetsChange} >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
        </>
      );


}

export default EditExercisePopup;