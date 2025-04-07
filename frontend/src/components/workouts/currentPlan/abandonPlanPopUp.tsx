import React from "react";
import "./currentPlanPage.css"
interface AbandonPlanPopUpProps {
    boolean: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}


const AbandonPlanPopUp: React.FC<AbandonPlanPopUpProps> = ({boolean, onConfirm, onCancel}) => {
    if (!boolean) return null;
    return (
        <div className="abandon-popup-overlay">
      <div className="abandon-popup-modal">
        <p>Are you sure you want to abandon your current workout plan?</p>
        <div className="abandon-popup-buttons">
          <button onClick={onCancel} className="popup-btn cancel-btn">
            Cancel
          </button>
          <button onClick={onConfirm} className="popup-btn confirm-btn">
            Confirm
          </button>
        </div>
      </div>
    </div>
    )

}
export default AbandonPlanPopUp;