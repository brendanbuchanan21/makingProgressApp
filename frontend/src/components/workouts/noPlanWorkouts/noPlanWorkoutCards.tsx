import '../../workouts/currentPlan/todaysWorkoutPage.css';
import trashImg from '../../../images/deleteTrash.svg'
import editMarker from '../../../images/editMarker.svg'
import deleteMarker from '../../../images/deleteMarker.svg'
import backArrow from '../../../images/backArrow.svg'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';




const NoPlanWorkoutCard = () => {



    const quickWorkoutState = useSelector((state: RootState) => state.quickWorkout);

    const exercises = quickWorkoutState.quickWorkout.exercises;

    const [editMode, setEditMode] = useState(false);


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
        {exercises.length > 0 ? (
          exercises.map((exercise) => (
          <div className="exercise-card" key={exercise.id}>
          <div className="exercise-card-header-div">
            <h3>{exercise.name}</h3>
            <img src={trashImg} alt="Delete Exercise" className="trash-img" />
          </div>
          <div className="exercise-card-button-container">
            <button>Add Set</button>
            <img src={editMarker} alt="Edit" onClick={() => setEditMode((prev) => !prev)} style={{cursor: 'pointer'}}/>
          </div>
          <div className="header-row">
            <div className="column-header set-number-header">Set</div>
            <div className="column-header">Weight</div>
            <div className="column-header">Reps</div>
            <div className="column-header">RIR</div>
          </div>
          <div className="sets-container">
            {exercise.sets.map((set) => (
              <div className="set-row" key={set.setNumber}>
              <div className="set-cell set-number-cell">
                {editMode && (
                  <img src={deleteMarker} alt="Delete Set" className="delete-marker" />
                )}
                {set.setNumber}
              </div>
              <div className="set-cell">
                <input type="number" min="0"  />
              </div>
              <div className="set-cell">
                <input type="number" min="0" />
              </div>
              <div className="set-cell">
                <input type="number" min="0" />
              </div>
            </div>
            ))}
            
          </div>
          <div className="exercise-completion">
            <label>Mark as Complete</label>
            <input type="checkbox" className="exercise-complete-checkbox" />
          </div>
        </div>
          ))
        ) : ( <p>Swag</p> 
        )}
        
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