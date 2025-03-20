
import './currentPlanPage.css'
import WeekCard from "./weekCard";
import NavBar from "../../dashboard/navbar";
import { Link } from "react-router-dom";
import { useState } from 'react';
import addMarkerBlue from '../../../images/addMarkerBlue.svg'
import { Dispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { addWeek } from '../../../redux/workoutSlice';
import { RootState } from '../../../redux/store';
import { useHandleAddWeekApiMutation } from '../../../redux/workoutApi';


const CurrentPlanPage = () => {

    const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [addWeekApi] = useHandleAddWeekApiMutation();

   const editMode = () => {
        setIsEditing(!isEditing);
   }

   const handleAddWeek = async () => {
        
        try{
            if(!currentPlan) {
                return;
            }
            const lastWeekNumber = currentPlan.weeks.length > 0 ? currentPlan.weeks[currentPlan.weeks.length - 1].weekNumber : 0;

            const newWeekNumber = lastWeekNumber + 1;

            // Get the first week's days and reset the 'isCompleted' status
            const daysForNewWeek = currentPlan.weeks.length > 0
            ? currentPlan.weeks[0].days.map(day => ({
                day: day.day,
                exercises: day.exercises.map(exercise => ({
                    id: exercise.id,
                    name: exercise.name,
                    muscleGroup: exercise.muscleGroup,
                    sets: exercise.sets.map((_, index) => ({
                        setNumber: index + 1, // Ensures setNumber starts from 1
                        reps: null,
                        weight: null,
                        rir: null
                    }))
                }))
            }))
            : [];


            addWeekApi({
                workoutPlanId: currentPlan._id,
                weekNumber: newWeekNumber,
                days: daysForNewWeek
            })

            dispatch(addWeek({
                workoutPlanId: currentPlan._id,
                weekNumber: newWeekNumber,
                days: daysForNewWeek
            }))
        } catch (error) {
            console.error(error);
        }
   }

    return (
        <>
        <section className="currentPlanPage">
            <NavBar />
            <div className="currentPlanPage-header-div">
                <h1>Your Plan</h1>
            </div>
            <div className="currentPlanPage-edit-plan-btn-div">
            <Link to="/workouts" className="currentPlanPage-back-btn">
            Back
            </Link>
                <button className="currentPlanPage-edit-btn" onClick={editMode}>Edit Plan</button>
            </div>
            <div className="grid-container">
                {/*we have to map over each week thats in the program for each card*/}
                <WeekCard isEditing={isEditing} />
            </div>
            {isEditing &&
            <div className='add-week-marker-div'>
                <div className='add-week-marker-wrapper' onClick={handleAddWeek}>
                <img src={addMarkerBlue} alt="" />
                <p>Add Week</p>
                </div>
               
            </div>
            }
        </section>
        </>
    )



}
export default CurrentPlanPage;
