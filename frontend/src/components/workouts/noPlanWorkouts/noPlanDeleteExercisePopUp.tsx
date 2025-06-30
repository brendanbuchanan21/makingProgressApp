import React from "react"
import "./delete-exercise-popup.css"

interface DeleteExercisePopUpProps {
    conditional: boolean;
    onConfirm: () => void;
    onCancel: () => void;

}

const DeleteExercisePopUp: React.FC<DeleteExercisePopUpProps> = ({conditional, onConfirm, onCancel}) => {

  if (!conditional) return null;
  
  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal-content">
        <h2 className="custom-modal-title">Delete Exercise</h2>
        <p className="custom-modal-message">
          Are you sure you want to delete this exercise?
        </p>
        <div className="custom-modal-buttons">
          <button className="confirm-btn" onClick={onConfirm}>
            Yes, delete
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

    

}

export default DeleteExercisePopUp;