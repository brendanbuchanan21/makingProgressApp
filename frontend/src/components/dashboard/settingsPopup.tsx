import React from 'react';
import './dashboard.css';

interface SettingsPopupProps {
    onClose: () => void;
}

const SettingsPopup: React.FC<SettingsPopupProps> = ({ onClose }) => {
    return (
        <div className='settings-popup-container'>
            <div className='settings-popup-smaller-container'>
                
            </div>
        </div>
    )
}