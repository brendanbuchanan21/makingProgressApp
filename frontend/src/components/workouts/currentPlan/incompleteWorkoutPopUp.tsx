import React from "react"
import './todaysWorkoutPage.css'


interface IncompleteWorkoutPopUpModal {
onOk: () => void;
boolean: boolean;
}

const IncompleteWorkoutPopUp: React.FC<IncompleteWorkoutPopUpModal> = ({onOk, boolean}) => {
if(!boolean) return null;

return (
    <div className="custom-modal-overlay">
      <div className="custom-modal-content">
        <h2 className="custom-modal-title">Incomplete Workout</h2>
        <p className="custom-modal-message">
          Please mark all exercises as complete before finishing your workout.
        </p>
        <div className="custom-modal-buttons">
          <button className="cancel-btn" onClick={onOk}>
            OK
          </button>
        </div>
      </div>
    </div>
  );

}

export default IncompleteWorkoutPopUp;