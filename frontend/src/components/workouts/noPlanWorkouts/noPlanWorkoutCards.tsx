import '../../workouts/currentPlan/todaysWorkoutPage.css';
import trashImg from '../../../images/deleteTrash.svg'
import editMarker from '../../../images/editMarker.svg'
import deleteMarker from '../../../images/deleteMarker.svg'
import backArrow from '../../../images/backArrow.svg'
import { useState } from 'react';



interface Set {
    setNumber: number, 
    Weight: number | null,
    Reps: number | null,
    RIR: number | null,

}

interface Exercise {
    name: string,
    sets: Set[],
}


const NoPlanWorkoutCard = () => {



    const [exercises, setExercises] = useState<Exercise[]>([]);
    
    
        const handeAddExercise = () => {
    
            const newExercise = {
                name: "",
                sets: [{Weight: null, Reps: null, RIR: null, setNumber: 1}]
            }
            setExercises([...exercises, newExercise]);
        }


        return (
            <>
    <section className="current-workout-page">
  <div className="current-workout-page-header-div">
    <h1>Quick Workout</h1>
  </div>
  <div className="current-workout-page-back-btn-div">
    <button className="back-btn-current-workout">
      <img src={backArrow} alt="Back" />
    </button>
  </div>
  <div className="current-workout-page-main-content-div">
    <div className="workout-card">
      <div className="workout-card-day-name-div">
        <h2>Workout Day</h2>
      </div>
      <ul>
        
          <div className="exercise-card">
            <div className="exercise-card-header-div">
              <input type="text" placeholder='Enter Exercise Name..' className='exercise-input'/>
              <img src={trashImg} alt="Delete Exercise" className="trash-img" />
            </div>
            <div className="exercise-card-button-container">
              <button>Add Set</button>
              <img src={editMarker} alt="Edit" />
            </div>
            <div className="header-row">
              <div className="column-header set-number-header">Set</div>
              <div className="column-header">Weight</div>
              <div className="column-header">Reps</div>
              <div className="column-header">RIR</div>
            </div>
            <div className="sets-container">
              <div className="set-row">
                <div className="set-cell set-number-cell">
                  <img src={deleteMarker} alt="Delete Set" className="delete-marker" />
                  1
                </div>
                <div className="set-cell">
                  <input type="number" min="0" value="" />
                </div>
                <div className="set-cell">
                  <input type="number" min="0" value="" />
                </div>
                <div className="set-cell">
                  <input type="number" min="0" value="" />
                </div>
              </div>
            </div>
            <div className="exercise-completion">
              <label>Mark as Complete</label>
              <input type="checkbox" className="exercise-complete-checkbox" />
            </div>
          </div>
        
      </ul>
    </div>
   
  </div>
  <div className='add-exercise-button-div'>
        <button>Add Exercise</button>
    </div>
  <div className="submit-todays-workout-div">
    <button className="complete-workout-btn">Complete Workout</button>
  </div>
</section>
            </>
        )

  
}

export default NoPlanWorkoutCard