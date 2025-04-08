import React from "react";

interface BackArrowPopUpProps {
    onConfirm: () => void;
    boolean: boolean;
    onCancel: () => void;
}


const BackArrowPopUp: React.FC<BackArrowPopUpProps> = ({onConfirm, boolean, onCancel}) => {
    if (!boolean) return null;

    return (
        <div className="custom-modal-overlay">
      <div className="custom-modal-content">
        <h2 className="custom-modal-title">Abandon Workout?</h2>
        <p className="custom-modal-message">
          Are you sure you want to abandon this workout? Your progress will be lost.
        </p>
        <div className="custom-modal-buttons">
        <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
    )
}

export default BackArrowPopUp;