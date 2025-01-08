import './newplanPopup.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NewPlanPopupProps {

    onClose: () => void;
}

const NewPlanPopup: React.FC<NewPlanPopupProps> = ({ onClose }) => {

    const [workoutDays, setWorkoutDays] = useState<string[]>([]);
    const [programDuration, setProgramDuration] = useState<string>('');
    const navigate = useNavigate();


    const handleDayClick = (day: string) => {
        setWorkoutDays((prevState) => 
            prevState.includes(day)
                ? prevState.filter((d) => d !== day) 
                : [...prevState, day]
        );
    }

    const handleDurationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setProgramDuration(event.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            console.log('selected workout days:', workoutDays);
            console.log('selected program duration:', programDuration);
            onClose();
    }

    const handleClose = () => {
        onClose();
        navigate('/workouts');
        
    }

return (
    <section className='NewPlan-popup-section'>
    <div className='NewPlan-popup-container'>
        <div className='NewPlan-popup-content'>
            <div className='NewPlan-popup-close-btn-div'>
                <button className='NewPlan-popup-close-btn' onClick={handleClose}>&times;</button>
            </div>
            <div className='NewPlan-popup-info-div'>
                <h2>Create your plan</h2>

                <form onSubmit={handleSubmit}>
                    <div className='NewPlan-which-days-container'>
                        <p>Which days will you workout?</p>
                        {['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'].map((day) => (
                            <button
                                key={day}
                                type="button"
                                className={`Newplan-day-of-week-btn ${workoutDays.includes(day) ? 'selected' : ''}`}
                                onClick={() => handleDayClick(day)}>
                                {day}
                            </button>
                        ))}
                    </div>

                    <div className='NewPlan-program-duration-div'>
                            <p>How long will this program be?</p>
                            <select
                                value={programDuration}
                                onChange={handleDurationChange}
                                className="program-duration-select"
                            >
                                <option value="" disabled>
                                    Select Duration
                                </option>
                                {['2 weeks', '3 weeks', '4 weeks', '5 weeks', '6 weeks', '7 weeks', '8 weeks'].map(
                                    (duration) => (
                                        <option key={duration} value={duration}>
                                            {duration}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                    <div className='NewPlan-submit-btn-div'>
                        <button type="submit" className="NewPlan-submit-btn">Next</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>
    
);


}


export default NewPlanPopup;