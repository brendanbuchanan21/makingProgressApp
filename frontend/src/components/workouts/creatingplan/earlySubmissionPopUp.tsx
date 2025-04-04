import React from "react"
import './submitworkoutpg.css'

interface EarlySubmissionPopUpProps {
  onOpen: boolean;
  onClose: () => void;
  title: string;
  message: string
}

const EarlySubmissionPopUp: React.FC <EarlySubmissionPopUpProps> = ({onOpen, onClose, title, message})  => {
  if(!onOpen) return null;

  return (
  <>
    <div className="popup-overlay">
      <div className="popup-container">
        <h2 className="popup-title">{title}</h2>
        <p className="popup-message">{message}</p>
        <div className="popup-button-container">
          <button className="popup-cancel-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  </>
  )
}
export default EarlySubmissionPopUp;