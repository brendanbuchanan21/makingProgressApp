import { useState } from "react";
import './editExercisePopup.css';


interface EditExercisePopupProps {
    exercise: {
        name: string;
        muscleGroup: string;
        sets: number;
        repsInReserve: number;
    };
    onSave: (updatedExercise: {
        name: string;
        muscleGroup: string;
        sets: number;
        repsInReserve: number;
    }) => void;
    onClose: () => void;
}

const EditExercisePopup: React.FC<EditExercisePopupProps> = ({ exercise, onSave, onClose }) => {
    // now we need to set local state to change the exercise
    const [name, setName] = useState(exercise.name);
    const [muscleGroup, setMuscleGroup] = useState(exercise.muscleGroup);
    const [sets, setSets] = useState(exercise.sets);
    const [repsInReserve, setRepsInReserve] = useState(exercise.repsInReserve);

    

    const handleSave = () => {
        const updatedExercise = {
            name, 
            muscleGroup,
            sets,
            repsInReserve,
        };



        onSave(updatedExercise);
    }

    return (
        <>
        <div className="overlay-for-submit-workout" />
        <div className="edit-exercise-popup">
        <p>Edit Exercise</p>
          <input value={name} onChange={(e) => setName(e.target.value)} className="edit-exercise-popup-input"/>
          <input value={muscleGroup} onChange={(e) => setMuscleGroup(e.target.value)} className="edit-exercise-popup-input" />
          <input value={sets} onChange={(e) => setSets(Number(e.target.value))} className="edit-exercise-popup-input" />
          <input value={repsInReserve} onChange={(e) => setRepsInReserve(Number(e.target.value))} className="edit-exercise-popup-input" />
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
        </>
      );


}

export default EditExercisePopup;