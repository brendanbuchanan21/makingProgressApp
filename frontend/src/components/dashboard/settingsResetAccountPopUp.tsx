import React from "react"



interface ResetAccountPopUpProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ResetAccountPopUp: React.FC<ResetAccountPopUpProps> = ({isOpen, onClose, onConfirm, title, message}) => {
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

export default ResetAccountPopUp;
