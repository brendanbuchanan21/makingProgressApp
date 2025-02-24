import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import './todaysWorkoutPage.css'
import NavBar from "../../dashboard/navbar";


// i need to grab the workout plan from the redux store? 
// display the first day in the plan that isn't completed 

const TodaysWorkoutPage = () => {


    const currentPlan = useSelector((state: RootState) => state.workout.currentPlan);


    //rememeber to put an if condition to activate the first workout day if no completed days was found

    //current plan . weeks .find(w) = > 


    if (!currentPlan || !currentPlan.weeks) {
        return <h1>No active workout plan found.</h1>;
    }


    //first workout day
    const firstWorkoutDay = currentPlan?.weeks[0]?.days[0];



    return (
        <>
        <NavBar />
        <section className="current-workout-page">
            <div className="current-workout-page-header-div">
            <h1>Current Workout</h1>
            </div>
            <div className="current-workout-page-main-content-div">
        {firstWorkoutDay ? (


            <div className="workout-card">
                <div className="workout-card-day-name-div">
                <h2>{firstWorkoutDay.day}</h2>
                </div>
                <h3>Exercises:</h3>
        <ul>
            {firstWorkoutDay.exercises.length > 0 ? (
                firstWorkoutDay.exercises.map((exercise, exerciseIndex) => (
                   <div key={exerciseIndex} className="exercise-card">
                    <h3>{exercise.name}</h3>
                    <div className="sets-container">
                {exercise.sets.map((set) => (
                    <div key={set.setNumber} className="set-box">
                        <p>Set {set.setNumber}: {set.reps} reps, {set.weight} lbs, RIR: {set.rir}</p>
                    </div>
                ))}
            </div>
                   </div>
                    //for each exercise, have its own card within the days card and then have sets in a vertical column on the left hand side for each set
                ))
            ) : (
                <li>No exercises scheduled.</li>
            )}
        </ul>
            </div>


        ) : (
            <p>No days found brother</p>
        )}
        </div>
        </section>
        </>
    )
}

export default TodaysWorkoutPage;