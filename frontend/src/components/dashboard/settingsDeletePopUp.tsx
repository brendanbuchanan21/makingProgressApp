import React from "react";
import './settingsPg.css'
import { useState } from "react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (password: string) => void;
    title: string;
    message: string;
  }

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message}) => {
    if(!isOpen) return null;

    const [password, setPassword] = useState("");


    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(password.trim() === "") {
            alert("Please enter your password.");
            return;
        }
        onConfirm(password);
    }

    return (
        <div className="modal-overlay-delete">
        <div className="modal-content-delete">
            <h2>{title}</h2>
            <p>{message}</p>
            <form onSubmit={handleSubmit}>
                <input 
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                required
                />
            <div className="modal-buttons-delete-setting">
                <button onClick={onClose} className="cancel-btn">Cancel</button>
                <button type="submit" className="confirm-btn">Confirm</button>
            </div>
            </form>
        </div>
    </div>
    )
}

export default ConfirmModal;