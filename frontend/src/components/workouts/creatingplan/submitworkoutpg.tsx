import { RootState } from "../../../redux/store";
import './submitworkoutpg.css';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from "../../dashboard/navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DayPlan } from "../../../redux/workoutSlice";
import ExpandedDayView from "./expandedDayView";
import { useDeleteExerciseProgramMutation } from "../../../redux/workoutApi";
import { duplicateFirstWeek } from "../../../redux/workoutSlice";
import { useDuplicateFirstWeekApiMutation } from "../../../redux/workoutApi";



const SubmitWorkoutPg = () => {

    const navigate = useNavigate();
    const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);
    const [deleteExerciseProgram] = useDeleteExerciseProgramMutation();
    const dispatch = useDispatch();
    const [duplicateFirstWeekApi] = useDuplicateFirstWeekApiMutation();

    const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);
    const workoutProgramId = currentPlan._id;


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
           
        }

    const submitWorkoutPlan = async () => {
        
        const isPlanComplete = firstWeekDays.every(day => day.exercises && day.exercises.length > 0);

        if (!isPlanComplete) {
            alert('Please make sure all days have exercises before submitting.');
            return;
        }
        const updatedWeeks = currentPlan.weeks.map((week, index) => {
            if (index === 0) return week; // Don't modify the first week
        
            const copiedDays = week.days.map((day, dayIndex) => {
                const firstWeekDayExercises = firstWeekDays[dayIndex]?.exercises || [];
        
                return {
                    ...day,
                    exercises: firstWeekDayExercises.map(({ _id, ...exerciseWithoutId }) => ({
                        ...exerciseWithoutId, // Copy all other fields but remove `_id`
                    })),
                };
            });
        
            return { ...week, days: copiedDays };
        });
        
        const updatedWorkoutPlan = { ...currentPlan, weeks: updatedWeeks };
        
        console.log(updatedWorkoutPlan, "please help");
        
        try {
            const response = await duplicateFirstWeekApi(updatedWorkoutPlan).unwrap();
        
            console.log('here is the response from the API request:', response);
        
            dispatch(duplicateFirstWeek(response)); // Ensure Redux gets the correct new data
        } catch (error) {
            console.error(error);
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