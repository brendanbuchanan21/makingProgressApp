import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store";
import { useState } from "react";
import './currentPlanPage.css'

const WeekCard = () => {
    const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);
    const weeks = currentPlan?.weeks ?? [];

    //local state for the week selection 
    const [selectedWeek, setSelectedWeek] = useState<number | null>(null);



const handleWeekClick = (weekNumber: number) => {
    setSelectedWeek(weekNumber);
}

    
    return (
        <>
        {weeks.map((week, index) => (
        <div className="week-card-div" key={index} onClick={() => handleWeekClick(week.weekNumber)}>
            <h3>Week {week.weekNumber}</h3>
            <p>{week.days.length} days</p>
            <button>View</button>
        </div>
        ))}
        </>
    )
}


export default WeekCard;