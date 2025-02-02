import './newplanPopup.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPlan } from '../../../redux/workoutSlice';
import { RootState } from '../../../redux/store';
import SubmitWorkoutPg from './submitworkoutpg';
import NavBar from '../../dashboard/navbar';

interface NewPlanPopupProps {

    onClose: () => void;
}

const NewPlanPopup = ({ onClose }: NewPlanPopupProps): JSX.Element => {


    const dispatch = useDispatch();
    const navigate = useNavigate();

     // Access the current workout plan from the Redux store
    const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);
    
    const [workoutDays, setWorkoutDays] = useState<string[]>([]);
    const [programDuration, setProgramDuration] = useState<string>(currentPlan?.duration || '');

    

    const handleDayClick = (day: string) => {
        
        const updatedDays = workoutDays.includes(day) ? workoutDays.filter((d) => d !== day) : [...workoutDays, day];
        setWorkoutDays(updatedDays);
    }

    const handleDurationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const updatedDuration = event.target.value;
        setProgramDuration(updatedDuration);
    
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const numberOfWeeks = parseInt(programDuration.split(" ")[0]); // As

        const weeks = Array.from({ length: numberOfWeeks }, (_, i) => ({
            weekNumber: i + 1,
            days: workoutDays.map((day) => ({
                day: day, // Copy the day from workoutDays array (e.g., 'Mon', 'Tue', etc.)
                exercises: [] // Empty array to be populated later with exercises for each week
            })),
        }));


        // Create a new plan object (in case no plan exists yet)
        const newPlan = {
            id: Date.now().toString(), // Unique ID
            name: 'New Plan',
            exercises: [], // Will add exercises later
            days: workoutDays,
            duration: programDuration,
            weeks,
        };

        // Dispatch the action to set the current plan in Redux
        dispatch(setCurrentPlan(newPlan));

        // Optionally navigate to another page after submitting
        navigate('/submitworkoutpg');
    };

    const handleClose = () => {
        onClose();
        navigate('/workouts');
        
    }

return (
    <>
    <NavBar />
    <section className='NewPlan-popup-section'>

    <div className='NewPlan-popup-back-btn-div'>
        <button className='NewPlan-popup-back-btn' onClick={handleClose} >&#x25c0; Back</button>
    </div>
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
                        <div className='day-of-week-btn-container'>
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
                        <button type="submit" className="NewPlan-submit-btn" disabled={workoutDays.length === 0 || !programDuration }>Next</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>
    </>
);


}


export default NewPlanPopup;