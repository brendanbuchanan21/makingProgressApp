import React from "react";
import mensBodyFat from '../../images/bodyFatPercentageMen.jpg'
import womensBodyFat from '../../images/womensBodyFat.jpg'
import { useState } from "react";
import './biometricsHome.css'



interface BodyFatPopupProps {
    onSubmit: (selectedBodyFat: number) => void;
    onBack: () => void;
    gender: string;
}

const BodyFatPopup: React.FC<BodyFatPopupProps> = ({onSubmit, onBack, gender}) => {

    const [bodyfatValue, setBodyFatValue] = useState("");
    return (
        <>
        <section className="body-fat-image-section">
            <h1>Based off these images, guestimate your own body fat percentage</h1>
            <img src={gender === "Female" ? womensBodyFat : mensBodyFat}  className="body-images"/>
            <div className="input-div-body-fat">
            <input placeholder="bodyfat percentage" value={bodyfatValue}  type="number" onChange={(e) => setBodyFatValue(e.target.value)}/>
            <button onClick={onBack}>Back</button>
            <button onClick={() => {
                            const num = parseFloat(bodyfatValue);
                            console.log("Submitting body fat:", num); // Debug log
                            if (!isNaN(num)) onSubmit(num);
                        }} className="second-biometric-pop-up-btn">Submit</button>
            </div>
        </section>
        </>
    )
}

export default BodyFatPopup;