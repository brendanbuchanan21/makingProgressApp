import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store";
import { useState } from "react";
import './currentPlanPage.css'
import ExpandedWeekView from "./expanedWeekView";

const WeekCard = () => {
    const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);
    const weeks = currentPlan?.weeks ?? [];

    //local state for the week selection 
    const [selectedWeek, setSelectedWeek] = useState<number | null>(null);



const handleWeekClick = (weekNumber: number) => {
    setSelectedWeek(weekNumber);
}

const handleCloseExpandedView = () => {
    setSelectedWeek(null);
}
const weekData = selectedWeek !== null ? weeks.find((week) => week.weekNumber === selectedWeek) : null;

    
    return (
        <>
        {weeks.map((week, index) => (
        <div className="week-card-div" key={index} onClick={() => handleWeekClick(week.weekNumber)}>
            <h3>Week {week.weekNumber}</h3>
            <p>{week.days.length} days</p>
            <button>View</button>
        </div>
        ))}



        {weekData && (
            <ExpandedWeekView
            weekNumber={weekData.weekNumber}
            weekData={weekData}
            onClose={handleCloseExpandedView}
            />
        )}
        </>
    )
}


export default WeekCard;