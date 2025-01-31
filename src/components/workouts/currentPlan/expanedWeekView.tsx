import { useState } from "react";
import { DayPlan, WeekPlan } from "../../../redux/workoutSlice";
import ExpandedDayView from "../creatingplan/expandedDayView";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface ExpandedWeekViewProps {
    weekNumber: number;
    weekData: WeekPlan;
    onClose: () => void;
}


const ExpandedWeekView: React.FC<ExpandedWeekViewProps> = ({ weekNumber, weekData, onClose }) => {

    const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);

    const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);


    const openDayCard = (day: DayPlan) => {
        setSelectedDay(day)
    }

    return (
        <>
        <div className="overlay-container">
        <div className="week-expanded-container">
            <div className="week-header-div">
            <h1>Week {weekNumber}</h1>
            <button className="close-popup-btn" onClick={onClose}>Close</button>
            </div>

            
                {weekData?.days.map((day, index) => {
                    const totalSets = day.exercises.reduce((sum, exercise) => sum + exercise.sets, 0)
                    return (
                    <div className="week-day-card" key={index} onClick={() => openDayCard(day)}>
                        <p>{day.day}</p>
                        <p>Total Sets: {totalSets}</p>
                    </div>
                    );
                })}
            
        </div>
        </div>

        {selectedDay && (
        <ExpandedDayView
          selectedDay={selectedDay} // Pass the full DayPlan object
          resetSelectedDay={() => setSelectedDay(null)} // Reset selected day
          weekNumber={weekNumber}
        />
      )}
        </>
    )


}
// when we select a day , it should have the associated data and the expandedDayView component should render
export default ExpandedWeekView;