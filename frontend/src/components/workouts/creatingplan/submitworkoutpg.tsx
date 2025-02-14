import { RootState } from "../../../redux/store";
import './submitworkoutpg.css';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from "../../dashboard/navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DayPlan } from "../../../redux/workoutSlice";
import ExpandedDayView from "./expandedDayView";
import { useDeleteExerciseProgramMutation } from "../../../redux/workoutApi";


const SubmitWorkoutPg = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);
    const [deleteExerciseProgram] = useDeleteExerciseProgramMutation();
    

    const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);
    const workoutProgramId = currentPlan.id;


    const firstWeekDays: DayPlan[] = currentPlan?.weeks?.[0]?.days ?? [];


    const getWeekNumber = (selectedDay: DayPlan | null): number | undefined => {
        if (!selectedDay) return undefined;

        for (const week of currentPlan.weeks) {
            if (week.days.some((day) => day.day === selectedDay.day)) {
                return week.weekNumber;
            }
        }
        return undefined;
    };
    const currentWeekNumber = getWeekNumber(selectedDay) ?? 0;

    const resetSelectedDay = () => {
        setSelectedDay(null);
    };
    
        const handleBackClick: () => Promise<void> = async () => {

            if(window.confirm("Are you sure you want to abandon this plan?")) {
                if(!workoutProgramId) {
                }
                try {
                     await deleteExerciseProgram({ id: workoutProgramId as string })
                     navigate('/workouts');

                } catch (error) {
                    console.error('unsuccessful deletion of program', error);
                }

            
            }
            // have logic once function is triggered, prompt
            // an alert, are you sure you want to leave this plan? 
            // once pressed ok, then we want to 
            // create new workout api function for deleting the program from DB

           
        }

    const submitWorkoutPlan = () => {
        
        const isPlanComplete = firstWeekDays.every(day => day.exercises && day.exercises.length > 0);

        if (!isPlanComplete) {
            alert('Please make sure all days have exercises before submitting.');
            return;
        }
    navigate('/workouts'); // Redirect to another page
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
             {firstWeekDays.map((day: DayPlan, index: number) => (
            <div className='AE-popup-day-card' key={index} onClick={() => setSelectedDay(day)}>
            <p className="AE-card-day-text">{day.day}</p>
            <p className="AE-btn">View</p>
            </div>
            ))}
                </div>
                <div className="AE-back-and-forward-btns-div">
            <button id="AE-back-btn" onClick={handleBackClick}>&lt; Back</button>
            <button onClick={submitWorkoutPlan}>Submit Plan</button>
                </div>
            </div>


            {/* Expanded Day View */}
            {selectedDay && (
                   <ExpandedDayView selectedDay={selectedDay}  resetSelectedDay={resetSelectedDay} weekNumber={currentWeekNumber} />
            )}
            </section>
            </>
            )
        }
export default SubmitWorkoutPg;