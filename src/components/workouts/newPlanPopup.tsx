import './newplanPopup.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPlan } from '../../redux/workoutSlice';
import { RootState } from '../../redux/store';
import AddExercisesPopUp from './addExercisesPopup';


interface NewPlanPopupProps {

    onClose: () => void;
}

const NewPlanPopup = ({ onClose }: NewPlanPopupProps): JSX.Element => {


    const dispatch = useDispatch();
    const navigate = useNavigate();

     // Access the current workout plan from the Redux store
    const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);
    
    // If no current plan, set default values
    const workoutDays = currentPlan ? currentPlan.days : [];
    const programDuration = currentPlan ? currentPlan.duration : '';

    const handleDayClick = (day: string) => {
        const updatedDays = workoutDays.includes(day)
        ? workoutDays.filter((d) => d !== day)
        : [...workoutDays, day];

        if (currentPlan) {
            // Dispatch only the days and duration
            dispatch(setCurrentPlan({
                days: updatedDays,
                duration: currentPlan.duration || '', // Ensure duration is always a string
            }));
        } else {
            // If no current plan, create a new plan with only days and duration
            dispatch(setCurrentPlan({
                days: updatedDays,
                duration: '', // or any default duration
            }));
        }
    }

    const handleDurationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const updatedDuration = event.target.value;
        if (currentPlan) {
            // Dispatch only the updated duration
            dispatch(setCurrentPlan({
                days: currentPlan.days,
                duration: updatedDuration,
            }));
        } else {
            // If no current plan, create a new plan with the selected duration
            dispatch(setCurrentPlan({
                days: [],
                duration: updatedDuration,
            }));
    };
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create a new plan object (in case no plan exists yet)
        const newPlan = {
            id: Date.now().toString(), // Unique ID
            name: 'New Plan',
            exercises: [], // Will add exercises later
            days: workoutDays,
            duration: programDuration,
        };

        // Dispatch the action to set the current plan in Redux
        dispatch(setCurrentPlan(newPlan));

        // Close the popup
        onClose();

        // Optionally navigate to another page after submitting
        navigate('/addExercisesPopup');
    };

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