"use client"
import "./currentPlanPage.css"
import NavBar from "../../dashboard/navbar"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addWeek } from "../../../redux/workoutSlice"
import type { RootState } from "../../../redux/store"
import { useHandleAddWeekApiMutation } from "../../../redux/workoutApi"
import { resetWorkoutState } from "../../../redux/workoutSlice"
import { usePostCompletedProgramMutation } from "../../../redux/completedProgramsApi"
import { useDeleteExerciseProgramMutation } from "../../../redux/workoutApi"
import AbandonPlanPopUp from "./abandonPlanPopUp"
import CurrentPlanSection from "./current-plan-section"
import PreviousPlanSection from "./previous-exercise-section"

const CurrentPlanPage = () => {
  const currentPlan = useSelector((state: RootState) => state.workout.currentPlan)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  // RTK queries
  const [deleteExerciseProgram] = useDeleteExerciseProgramMutation()
  const [addWeekApi] = useHandleAddWeekApiMutation()
  const [postCompletedProgram] = usePostCompletedProgramMutation()

  //states
  const [noPlan, setNoPlan] = useState(false)
  const [showAbandonPlan, setShowAbandonPlan] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Check if all days in plan are complete
  const allDaysComplete = currentPlan?.weeks?.every((week) => week.days.every((day) => day.isCompleted)) ?? false
  const programComplete = allDaysComplete

  useEffect(() => {
    if (!currentPlan || !currentPlan._id) {
      setNoPlan(true)
    } else {
      setNoPlan(false)
    }
  }, [currentPlan])

  const handleAddWeek = async () => {
    try {
      if (!currentPlan) {
        return
      }

      const lastWeekNumber =
        currentPlan.weeks.length > 0 ? currentPlan.weeks[currentPlan.weeks.length - 1].weekNumber : 0
      const newWeekNumber = lastWeekNumber + 1

      const daysForNewWeek =
        currentPlan.weeks.length > 0
          ? currentPlan.weeks[0].days.map((day) => ({
              day: day.day,
              exercises: day.exercises.map((exercise) => ({
                id: exercise._id,
                name: exercise.name,
                muscleGroup: exercise.muscleGroup,
                sets: exercise.sets.map((_, index) => ({
                  setNumber: index + 1,
                  reps: null,
                  weight: null,
                  rir: null,
                })),
              })),
            }))
          : []

      const response = await addWeekApi({
        workoutPlanId: currentPlan._id,
        weekNumber: newWeekNumber,
        days: daysForNewWeek,
      }).unwrap()

      const newWeek = response.weeks.find((week) => week.weekNumber === newWeekNumber)

      if (!newWeek) {
        console.error("new week not found in response")
        return
      }

      dispatch(addWeek({ workoutPlanId: currentPlan._id, newWeek }))
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmitPlan = async () => {
    const completedPlan = {
      workoutPlanId: currentPlan._id,
      name: currentPlan.name ?? "Untitled Program",
      startDate: currentPlan.startDate,
      duration: currentPlan.duration,
    }

    try {
      await postCompletedProgram(completedPlan).unwrap()
      navigate("/workouts")
    } catch (error) {
      console.error("error posting completed program:", error)
    }

    try {
      await deleteExerciseProgram({ id: completedPlan.workoutPlanId }).unwrap()
      dispatch(resetWorkoutState())
    } catch (error) {
      console.error("error caught before making query:", error)
    }
  }


  const handleAbandonPlan = async () => {
    await deleteExerciseProgram({ id: currentPlan._id })
    dispatch(resetWorkoutState())
    setShowAbandonPlan(false)
    setIsEditing(false)
  }
  
 
  // current plan props passing objects
  const currentPlanControls = {
  programComplete,
  isEditing,
  setIsEditing,
  setShowAbandonPlan,
  handleSubmitPlan,
  handleAddWeek,
}

  return (
    <>
      {showAbandonPlan && (
        <AbandonPlanPopUp
          boolean={showAbandonPlan}
          onConfirm={handleAbandonPlan}
          onCancel={() => setShowAbandonPlan(false)}
        />
      )}

      <NavBar />

      {noPlan ? (
        <section className="CPP-no-plan-section">
          <div className="CPP-no-plan-content">
            <div className="CPP-no-plan-icon">📋</div>
            <h2 className="CPP-no-plan-title">No Active Plan</h2>
            <p className="CPP-no-plan-description">Create a workout plan to get started with your fitness journey</p>
            <Link to="/workouts" className="CPP-btn CPP-btn-primary">
              <span>Back to Workouts</span>
              <svg className="CPP-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      ) : (
        <>
          {/* Current Plan Section */}
          <CurrentPlanSection controls={currentPlanControls} />
        </>
      )}
      {/* Previous Plans Section */}
      <PreviousPlanSection />
    </>
  )
}

export default CurrentPlanPage
