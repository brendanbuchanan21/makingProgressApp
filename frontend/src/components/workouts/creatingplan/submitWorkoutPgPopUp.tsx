import React from "react";
import './submitworkoutpg.css'

interface BackClickPopUpProps {
    onOpen: boolean;
    onConfirm: () => void;
    onClose: () => void;
    title: string;
    message: string;
}

const BackClickPopUp: React.FC<BackClickPopUpProps> = ({onOpen, onConfirm, onClose, title, message}) => {

    if(!onOpen) return null;

    return (
        <>
         <div className="popup-overlay">
            <div className="popup-container">
                <h2 className="popup-title">{title}</h2>
                <p className="popup-message">{message}</p>
                <div className="popup-button-container">
                    <button className="popup-confirm-btn" onClick={onConfirm}>Yes</button>
                    <button className="popup-cancel-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default BackClickPopUp;