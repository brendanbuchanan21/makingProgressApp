import React from "react";
import './settingsPg.css'


interface SignOutModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    onConfirm: () => void;

}

const SignOutModal: React.FC<SignOutModalProps> = ({isOpen, onClose, title, message, onConfirm}) => {

    if(!isOpen) return null;

return (
    <div className="modal-overlay-delete">
        <div className="modal-content-delete">
            <h2>{title}</h2>
            <p>{message}</p>
            <div className="modal-buttons-delete-setting">
                <button onClick={onClose} className="cancel-btn">Cancel</button>
                <button onClick={onConfirm} className="confirm-btn">Confirm</button>
            </div>
        </div>
    
    </div>
)
}

export default SignOutModal;