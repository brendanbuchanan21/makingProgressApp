import '../creatingplan/submitworkoutpg.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addExercise } from '../../../redux/noPlanWorkoutSlice'
import { noPlanSet } from '../../../redux/noPlanWorkoutSlice'
import { v4 as uuidv4 } from 'uuid';

interface addingExerciseProps {
    setAddingExercise: React.Dispatch<React.SetStateAction<boolean>>
}

const AddExerciseEntry: React.FC<addingExerciseProps> = ({ setAddingExercise }) => {



    const handleBackClick = () => {
        setAddingExercise(false);
    }

    const [exerciseName, setExerciseName] = useState("");
    const [muscleGroup, setMuscleGroup] = useState("Chest");
    const [numberofSets, setNumberOfSets] = useState<number | null>(null);
    const dispatch = useDispatch();



    // Generate sets array based on number of sets selected
    const generateSets = (numSets: number): noPlanSet[] => {
        return Array.from({ length: numSets }, (_, index) => ({
            setNumber: index + 1,
            id: uuidv4(),
            reps: null,  // Default reps
            weight: null, // Default weight
            rir: null     // Default RIR
        }));
    };



    const handleAddExercise = () => {

        if(exerciseName && numberofSets) {
             // ill have to dispatch the add exercise
        const newExercise = {
            id: uuidv4(),
            name: exerciseName,
            muscleGroup: muscleGroup,
            sets: generateSets(numberofSets),
        }

        dispatch(addExercise(newExercise));

        setExerciseName("");
        setMuscleGroup("Chest");
        setNumberOfSets(null);
        setAddingExercise(false);
        }
        
    }
   

    return (
        <>
       <div className="overlay-for-submit-workout"></div>
<div className="expanded-day-card">
    <h2>Exercise</h2>
    <div className="add-exercise-form">
        <input type="text" placeholder="Exercise Name" id="exercise-name" onChange={(e) => setExerciseName(e.target.value)}/>
        <select id="muscle-group" value={muscleGroup} onChange={(e) => setMuscleGroup(e.target.value)}>
            <option value="Chest">Chest</option>
            <option value="Triceps">Triceps</option>
            <option value="Biceps">Biceps</option>
            <option value="Back">Back</option>
            <option value="Shoulders">Shoulders</option>
            <option value="Legs">Legs</option>
            <option value="Abs">Abs</option>
            <option value="Calves">Calves</option>
        </select>
        <select id="sets" value={numberofSets ?? ""} onChange={(e) => setNumberOfSets(Number(e.target.value))}>
            <option value="">Select Sets</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
        <div className="AE-btns-div">
            <button onClick={handleBackClick}>&#x25c0; Back</button>
            <button onClick={handleAddExercise}>Add Exercise</button>
        </div>
    </div>
</div>

        </>
    )
}

export default AddExerciseEntry;