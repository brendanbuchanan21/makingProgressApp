import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store";
import './currentPlanPage.css'


const WeekCard = () => {
    const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);
    const weeks = currentPlan?.weeks ?? [];





    
    return (
        <>
        {weeks.map((week, index) => (
        <div className="week-card-div" key={index} >
            <div className="week-card-head-text-div">
            <h3>Week {week.weekNumber}</h3>
            <p>{week.days.every(day => day.isCompleted) ? 'Completed ✅' : 'In Progress'}</p>
            </div>
            <div className="week-card-exercises-div">
                <p className="week-card-exercise-text">Exercises:</p>
            
            {week.days.map((day, dayIndex) => (
              <p key={dayIndex} className="exercise-in-week-card-text">
                <strong>{day.day}:</strong>{' '}
                {day.exercises && day.exercises.length > 0
                  ? day.exercises.map((exercise, exIndex) => (
                      <span key={exIndex}>
                        {exercise.name}
                        {exIndex !== day.exercises.length - 1 ? ', ' : ''}
                      </span>
                    ))
                  : 'No exercises'}
              </p>
            ))}
            {}
            </div>
        </div>
        ))}


        </>
    )
}


export default WeekCard;