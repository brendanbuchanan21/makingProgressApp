"use client"

import type { RootState } from "../../../redux/store"
import "./submitworkoutpg.css"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import type { DayPlan } from "../../../redux/workoutSlice"
import ExpandedDayView from "./expandedDayView"
import { useDeleteExerciseProgramMutation } from "../../../redux/workoutApi"
import { duplicateFirstWeek } from "../../../redux/workoutSlice"
import { useDuplicateFirstWeekApiMutation } from "../../../redux/workoutApi"
import BackClickPopUp from "./submitWorkoutPgPopUp"
import { resetWorkoutState } from "../../../redux/workoutSlice"
import EarlySubmissionPopUp from "./earlySubmissionPopUp"

const SubmitWorkoutPg = () => {
  const navigate = useNavigate()
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null)
  const [deleteExerciseProgram] = useDeleteExerciseProgramMutation()
  const dispatch = useDispatch()
  const [duplicateFirstWeekApi] = useDuplicateFirstWeekApiMutation()
  const [backClick, setBackClick] = useState(false)
  const [earlySubmission, setEarlySubmission] = useState(false)

  const currentPlan = useSelector((state: RootState) => state.workout.currentPlan)
  const workoutProgramId = currentPlan._id
  const firstWeekDays: DayPlan[] = currentPlan?.weeks?.[0]?.days ?? []

  const getWeekNumber = (selectedDay: DayPlan | null): number | undefined => {
    if (!selectedDay) return undefined
    for (const week of currentPlan.weeks) {
      if (week.days.some((day) => day.day === selectedDay.day)) {
        return week.weekNumber
      }
    }
    return undefined
  }

  const currentWeekNumber = getWeekNumber(selectedDay) ?? 0

  const resetSelectedDay = () => {
    setSelectedDay(null)
  }

  const handleBackClick: () => Promise<void> = async () => {
    try {
      await deleteExerciseProgram({ id: workoutProgramId as string })
      dispatch(resetWorkoutState())
      navigate("/workouts")
    } catch (error) {
      console.error("unsuccessful deletion of program", error)
    }
  }

  const submitWorkoutPlan = async () => {
    const isPlanComplete = firstWeekDays.every((day) => day.exercises && day.exercises.length > 0)

    if (!isPlanComplete) {
      setEarlySubmission(true)
      return
    }

    const updatedWeeks = currentPlan.weeks.map((week, index) => {
      if (index === 0) return week // Don't modify the first week

      const copiedDays = week.days.map((day, dayIndex) => {
        const firstWeekDayExercises = firstWeekDays[dayIndex]?.exercises || []

        return {
          ...day,
          exercises: firstWeekDayExercises.map(({ _id, ...exerciseWithoutId }) => ({
            ...exerciseWithoutId, // Copy all other fields but remove `_id`
          })),
        }
      })

      return { ...week, days: copiedDays }
    })

    const updatedWorkoutPlan = { ...currentPlan, weeks: updatedWeeks }

    try {
      const response = await duplicateFirstWeekApi(updatedWorkoutPlan).unwrap()
      dispatch(duplicateFirstWeek(response)) // Ensure Redux gets the correct new data
    } catch (error) {
      console.error(error)
    }

    navigate("/workouts") // Redirect to another page
  }

  // Calculate completion status
  const completedDays = firstWeekDays.filter((day) => day.exercises && day.exercises.length > 0).length
  const totalDays = firstWeekDays.length
  const completionPercentage = totalDays > 0 ? (completedDays / totalDays) * 100 : 0

  return (
    <>
      <section className="SWP-section">
        <div className="SWP-overlay">
          <div className="SWP-container">
            {/* Header */}
            <div className="SWP-header">
              <div className="SWP-header-content">
                <div className="SWP-header-icon">📋</div>
                <div className="SWP-header-text">
                  <h1 className="SWP-title">Plan Your Week</h1>
                  <p className="SWP-subtitle">Add exercises to each workout day to complete your plan</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="SWP-progress-section">
                <div className="SWP-progress-header">
                  <span className="SWP-progress-label">Progress</span>
                  <span className="SWP-progress-text">
                    {completedDays} of {totalDays} days completed
                  </span>
                </div>
                <div className="SWP-progress-bar">
                  <div className="SWP-progress-fill" style={{ width: `${completionPercentage}%` }} />
                </div>
              </div>
            </div>

            {/* Days Grid */}
            <div className="SWP-days-grid">
              {firstWeekDays.map((day: DayPlan, index: number) => {
                const hasExercises = day.exercises && day.exercises.length > 0
                return (
                  <div
                    className={`SWP-day-card ${hasExercises ? "SWP-day-card-completed" : ""}`}
                    key={index}
                    onClick={() => setSelectedDay(day)}
                  >
                    <div className="SWP-day-header">
                      <h3 className="SWP-day-name">{day.day}</h3>
                      {hasExercises && (
                        <div className="SWP-day-status">
                          <svg className="SWP-check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="SWP-day-content">
                      {hasExercises ? (
                        <div className="SWP-day-info">
                          <p className="SWP-exercise-count">
                            {day.exercises.length} exercise{day.exercises.length !== 1 ? "s" : ""}
                          </p>
                          <div className="SWP-muscle-groups">
                            {[...new Set(day.exercises.map((ex) => ex.muscleGroup))].slice(0, 2).map((muscle, idx) => (
                              <span key={idx} className="SWP-muscle-tag">
                                {muscle}
                              </span>
                            ))}
                            {[...new Set(day.exercises.map((ex) => ex.muscleGroup))].length > 2 && (
                              <span className="SWP-muscle-tag SWP-muscle-tag-more">
                                +{[...new Set(day.exercises.map((ex) => ex.muscleGroup))].length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="SWP-day-empty">
                          <svg className="SWP-plus-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <p>Add exercises</p>
                        </div>
                      )}
                    </div>

                    <div className="SWP-day-footer">
                      <button className="SWP-view-btn">
                        <span>{hasExercises ? "Edit" : "Add"}</span>
                        <svg className="SWP-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="SWP-actions">
              <button className="SWP-btn SWP-btn-secondary" onClick={() => setBackClick(true)}>
                <svg className="SWP-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>

              <button
                className="SWP-btn SWP-btn-primary"
                onClick={submitWorkoutPlan}
                disabled={completionPercentage < 100}
              >
                <span>Submit Plan</span>
                <svg className="SWP-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Day View */}
        {selectedDay && (
          <ExpandedDayView
            selectedDay={selectedDay}
            resetSelectedDay={resetSelectedDay}
            weekNumber={currentWeekNumber}
          />
        )}

        {/* Modals */}
        {backClick && (
          <BackClickPopUp
            onOpen={backClick}
            onConfirm={handleBackClick}
            onClose={() => setBackClick(false)}
            title="Abandon plan"
            message="Are you sure you want to abandon this plan?"
          />
        )}

        {earlySubmission && (
          <EarlySubmissionPopUp
            onOpen={earlySubmission}
            onClose={() => setEarlySubmission(false)}
            title="Not Complete"
            message="Fill out all days before submitting plan"
          />
        )}
      </section>
    </>
  )
}

export default SubmitWorkoutPg
