import { RootState } from "../../../redux/store";
import './submitworkoutpg.css';
import { useDispatch, useSelector, UseSelector } from 'react-redux';
import NavBar from "../../dashboard/navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { DayPlan, WeekPlan } from "../../../redux/workoutSlice";
import ExpandedDayView from "./expandedDayView";


const SubmitWorkoutPg = () => {

    const navigate = useNavigate();
    const [selectedDay, setSelectedDay] = useState<string | null>(null);

    const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);
    const days: DayPlan[] = currentPlan?.weeks?.flatMap((week: WeekPlan) => week.days) ?? [];



    const getWeekNumber = (selectedDay: string | null): number | undefined => {
        if (!selectedDay) return undefined;

        for (const week of currentPlan.weeks) {
            if (week.days.some((day) => day.day === selectedDay)) {
                return week.weekNumber;
            }
        }
        return undefined;
    };
    const currentWeekNumber = getWeekNumber(selectedDay) ?? 0;

    const resetSelectedDay = () => {
        setSelectedDay(null);
    };
    
        const handleBackClick: () => void = () => {
            navigate('/workouts');
        }

    // JSX 
    return (
        <>
        <NavBar />
        <section id='add-exercises-popup-section'>
            <div id='add-exercises-popup-outer-container'>

            <div id='add-exercises-popup-header-div'>
                <h1 id="add-exercises-popup-head-text">Plan your week</h1>
            </div>
                    
                    
                <div className="AE-popup-days-container">
             {days.map((day: DayPlan, index: number) => (
            <div className='AE-popup-day-card' key={index} onClick={() => setSelectedDay(day.day)}>
            <p className="AE-card-day-text">{day.day}</p>
            <p className="AE-btn">View</p>
            </div>
            ))}
                </div>
                <div className="AE-back-and-forward-btns-div">
            <button id="AE-back-btn" onClick={handleBackClick}>&lt; Back</button>
            <button>Submit Plan</button>
                </div>
            </div>


            {/* Expanded Day View */}
            {selectedDay && (
                   <ExpandedDayView selectedDay={selectedDay}  resetSelectedDay={resetSelectedDay} weekNumber={currentWeekNumber}  />
            )}
            </section>
            </>
            )
        }
export default SubmitWorkoutPg;