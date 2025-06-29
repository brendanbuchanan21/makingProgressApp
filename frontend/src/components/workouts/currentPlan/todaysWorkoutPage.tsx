"use client"

import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import type { RootState } from "../../../redux/store"
import "./todaysWorkoutPage.css"
import NavBar from "../../dashboard/navbar"
import type { Exercise, SetDetails } from "../../../redux/workoutSlice"
import { removeSetFromExercise, deleteExercise, updateDayCompletion } from "../../../redux/workoutSlice"
import { addSetToExercise, updateSetDetails } from "../../../redux/workoutSlice"
import {
  useAddSetToExerciseApiMutation,
  useDeleteExerciseApiMutation,
  useDeleteSetFromExerciseApiMutation,
  useUpdateWorkoutCompletionApiMutation,
} from "../../../redux/workoutApi"
import { usePostCompletedExerciseMutation } from "../../../redux/completedWorkoutApi"
import { useNavigate } from "react-router-dom"
import IncompleteWorkoutPopUp from "./incompleteWorkoutPopUp"

const TodaysWorkoutPage = () => {
  const dispatch = useDispatch()
  const currentPlan = useSelector((state: RootState) => state.workout.currentPlan)

  // useState section
  const [editMode, setEditMode] = useState(false)
  const [showDeletePopUp, setShowDeletePopUp] = useState(false)
  const [exerciseToDelete, setExerciseToDelete] = useState<Exercise | null>(null)
  const [cantDeletePopUp, setCantDeletePopUp] = useState(false)
  const [showIncomplete, setShowIncomplete] = useState(false)
  const navigate = useNavigate()
  const [completedExercises, setCompletedExercises] = useState<{ [key: string]: boolean }>({})

  const [postCompletedExercise] = usePostCompletedExerciseMutation()
  const [updateCompletedWorkout] = useUpdateWorkoutCompletionApiMutation()

  const toggleExerciseCompletion = (exerciseId: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }))
  }

  const firstIncompleteWeek = currentPlan?.weeks.find((week) => week.days.some((day) => !day.isCompleted))
  const firstIncompleteWorkout = firstIncompleteWeek?.days.find((day) => !day.isCompleted)

  if (!firstIncompleteWorkout) {
    return null
  }

  const handleSetChange = (
    exerciseId: string | any,
    setId: string | any,
    field: keyof SetDetails,
    value: string | number,
  ) => {
    const parsedValue = value === "" ? null : Number(value)
    dispatch(
      updateSetDetails({
        weekNumber,
        day: firstIncompleteWorkout.day,
        exerciseId,
        setId,
        updatedSet: { [field]: parsedValue },
      }),
    )
  }

 

  const [addingSetToExercise] = useAddSetToExerciseApiMutation()
  const [deleteSetFromExercise] = useDeleteSetFromExerciseApiMutation()
  const [deleteExerciseApi] = useDeleteExerciseApiMutation()

  const weekNumber = firstIncompleteWeek?.weekNumber

  const handleAddSet = async (exercise: Exercise) => {
    try {
      if (currentPlan && currentPlan._id && weekNumber !== null && firstIncompleteWorkout && exercise._id) {
        const newSetNumber = exercise.sets.length + 1
        const newSet: SetDetails = {
          setNumber: newSetNumber,
          reps: null,
          weight: null,
          rir: null,
        }

        const result = await addingSetToExercise({
          workoutId: currentPlan._id,
          weekNumber,
          day: firstIncompleteWorkout.day,
          exerciseId: exercise._id,
          newSet,
        })

        if (result.data && result.data.newSet._id) {
          const newSetWithId = {
            ...newSet,
            _id: result.data.newSet._id,
          }

          dispatch(
            addSetToExercise({
              weekNumber,
              day: firstIncompleteWorkout.day,
              exerciseId: exercise._id,
              newSet: newSetWithId,
            }),
          )
        } else {
          console.error("Failed to get the new set ID from the backend.")
        }
      } else {
        console.warn("Missing required data to add set.")
      }
    } catch (error) {
      console.error("Error adding set:", error)
    }
  }

  const deleteSet = async (set: SetDetails, exercise: Exercise) => {
    try {
      if (currentPlan && currentPlan._id && weekNumber !== null && firstIncompleteWorkout && exercise._id && set._id) {
        await deleteSetFromExercise({
          workoutId: currentPlan._id,
          weekNumber,
          day: firstIncompleteWorkout.day,
          exerciseId: exercise._id,
          setId: set._id,
        })

        dispatch(
          removeSetFromExercise({
            weekNumber,
            day: firstIncompleteWorkout.day,
            exerciseId: exercise._id,
            setId: set._id,
          }),
        )
      } else {
        console.warn("Missing required data to delete set.")
      }
    } catch (error) {
      console.error("Error deleting set:", error)
    }
  }

  const deleteExerciseFromCurrentDay = async (exercise: Exercise) => {
    try {
      if (exercise._id && currentPlan && currentPlan._id && weekNumber !== null && firstIncompleteWorkout) {
        await deleteExerciseApi({
          workoutId: currentPlan._id,
          exerciseId: exercise._id,
          weekNumber,
          day: firstIncompleteWorkout.day,
        }).unwrap()

        dispatch(
          deleteExercise({
            weekNumber,
            day: firstIncompleteWorkout.day,
            exerciseId: exercise._id,
          }),
        )
      } else {
        console.warn("missing data required for exercise deletion")
      }
    } catch (error) {
      console.error("the try block did not execute:", error)
    }
  }

  const sendCompletedExercise = async (completedWorkout: any) => {
    try {
      await postCompletedExercise(completedWorkout).unwrap()
    } catch (error) {
      console.error("API request failed:", JSON.stringify(error, null, 2))
    }
  }

  const completedWorkoutUpdate = async (completedWorkout: any) => {
    try {
      await updateCompletedWorkout({
        workoutPlanId: completedWorkout.workoutPlanId,
        weekNumber: completedWorkout.weekNumber,
        day: completedWorkout.day,
        isCompleted: true,
      }).unwrap()

      dispatch(
        updateDayCompletion({
          weekNumber: completedWorkout.weekNumber,
          day: completedWorkout.day,
          isCompleted: true,
        }),
      )
    } catch (error) {
      console.error(error, "we could not update the workout to complete")
      return
    }
  }

  const handleSubmitWorkout = async () => {
    const allComplete = firstIncompleteWorkout.exercises.every((exercise) => {
      return exercise._id ? completedExercises[exercise._id] : false
    })

    if (!allComplete) {
      setShowIncomplete(true)
      return
    }

    let weekNumber = null

    if (firstIncompleteWorkout) {
      for (const week of currentPlan.weeks) {
        const foundDay = week.days.find((day) => day._id === firstIncompleteWorkout._id)
        if (foundDay) {
          weekNumber = week.weekNumber
          break
        }
      }
    } else {
      console.error("Workout day _id is missing.")
      return
    }

    if (currentPlan && currentPlan.weeks && currentPlan.weeks[0] && currentPlan.weeks[0].days[0]) {
      const completedWorkout = {
        workoutPlanId: currentPlan._id,
        weekNumber: weekNumber,
        day: firstIncompleteWorkout.day,
        exercises: firstIncompleteWorkout.exercises,
      }

      try {
        sendCompletedExercise(completedWorkout)
        completedWorkoutUpdate(completedWorkout)
      } catch (error) {
        console.error("❌ Error submitting workout, staying on page:", error)
      }

      navigate("/workouts")
    } else {
      console.error("workout plan data is missing")
    }
  }

  const handleBackClick = () => {
    return navigate("/workouts")
  }

  // Calculate completion progress
  const completedCount = Object.values(completedExercises).filter(Boolean).length
  const totalExercises = firstIncompleteWorkout.exercises.length
  const completionPercentage = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0

  return (
    <>
      <NavBar />
      <section className="TWP-section">
        {/* Hero Section */}
        <div className="TWP-hero-section">
          <div className="TWP-header-content">
            <button className="TWP-back-btn" onClick={handleBackClick}>
              <svg className="TWP-back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="TWP-header-text">
              <h1 className="TWP-main-title">Today's Workout</h1>
              <p className="TWP-subtitle">
                {firstIncompleteWorkout.day} • Week {weekNumber}
              </p>
            </div>
            <div className="TWP-edit-toggle">
              <button
                className={`TWP-edit-btn ${editMode ? "TWP-edit-btn-active" : ""}`}
                onClick={() => setEditMode((prev) => !prev)}
              >
                <svg className="TWP-edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>{editMode ? "Done" : "Edit"}</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="TWP-progress-section">
            <div className="TWP-progress-header">
              <span className="TWP-progress-label">Progress</span>
              <span className="TWP-progress-text">
                {completedCount} of {totalExercises} exercises completed
              </span>
            </div>
            <div className="TWP-progress-bar">
              <div className="TWP-progress-fill" style={{ width: `${completionPercentage}%` }} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="TWP-container">
          {firstIncompleteWorkout ? (
            <div className="TWP-workout-content">
              {firstIncompleteWorkout.exercises.length > 0 ? (
                <div className="TWP-exercises-grid">
                  {firstIncompleteWorkout.exercises.map((exercise) => (
                    <div key={exercise._id} className="TWP-exercise-card">
                      {/* Exercise Header */}
                      <div className="TWP-exercise-header">
                        <div className="TWP-exercise-info">
                          <h3 className="TWP-exercise-name">{exercise.name}</h3>
                          <span className="TWP-exercise-muscle">{exercise.muscleGroup}</span>
                        </div>
                        <div className="TWP-exercise-actions">
                          <button className="TWP-add-set-btn" onClick={() => handleAddSet(exercise)}>
                            <svg className="TWP-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add Set</span>
                          </button>
                          {editMode && (
                            <button
                              className="TWP-delete-exercise-btn"
                              onClick={() => {
                                if (firstIncompleteWorkout.exercises.length >= 2) {
                                  setExerciseToDelete(exercise)
                                  setShowDeletePopUp(true)
                                } else {
                                  setCantDeletePopUp(true)
                                }
                              }}
                            >
                              <svg className="TWP-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Sets Table */}
                      <div className="TWP-sets-container">
                        <div className="TWP-sets-header">
                          <div className="TWP-header-cell TWP-set-number">Set</div>
                          <div className="TWP-header-cell">Weight</div>
                          <div className="TWP-header-cell">Reps</div>
                          <div className="TWP-header-cell">RIR</div>
                        </div>

                        <div className="TWP-sets-body">
                          {exercise.sets.map((set) => (
                            <div key={set.setNumber} className="TWP-set-row">
                              <div className="TWP-set-cell TWP-set-number-cell">
                                {editMode && (
                                  <button className="TWP-delete-set-btn" onClick={() => deleteSet(set, exercise)}>
                                    <svg
                                      className="TWP-delete-icon"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                )}
                                <span className="TWP-set-number">{set.setNumber}</span>
                              </div>
                              <div className="TWP-set-cell">
                                <input
                                  type="number"
                                  min="0"
                                  className="TWP-set-input"
                                  placeholder="lbs"
                                  value={set.weight === null ? "" : set.weight}
                                  onChange={(e) => handleSetChange(exercise._id, set._id, "weight", e.target.value)}
                                />
                              </div>
                              <div className="TWP-set-cell">
                                <input
                                  type="number"
                                  min="0"
                                  className="TWP-set-input"
                                  placeholder="reps"
                                  value={set.reps === null ? "" : set.reps}
                                  onChange={(e) => handleSetChange(exercise._id, set._id, "reps", e.target.value)}
                                />
                              </div>
                              <div className="TWP-set-cell">
                                <input
                                  type="number"
                                  min="0"
                                  className="TWP-set-input"
                                  placeholder="rir"
                                  value={set.rir === null ? "" : set.rir}
                                  onChange={(e) => handleSetChange(exercise._id, set._id, "rir", e.target.value)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Exercise Completion */}
                      <div className="TWP-exercise-completion">
                        <label className="TWP-completion-label">
                          <input
                            type="checkbox"
                            className="TWP-completion-checkbox"
                            checked={exercise._id ? !!completedExercises[exercise._id] : false}
                            onChange={() => {
                              if (exercise._id) {
                                toggleExerciseCompletion(exercise._id)
                              }
                            }}
                          />
                          <span className="TWP-completion-text">Mark as Complete</span>
                          <div className="TWP-checkmark">
                            <svg className="TWP-check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="TWP-empty-state">
                  <div className="TWP-empty-icon">🏋️‍♀️</div>
                  <h3>No exercises scheduled</h3>
                  <p>Add some exercises to get started with your workout</p>
                </div>
              )}
            </div>
          ) : (
            <div className="TWP-empty-state">
              <div className="TWP-empty-icon">📅</div>
              <h3>No workout found</h3>
              <p>All workouts are complete or no plan is active</p>
            </div>
          )}

          {/* Submit Button */}
          {firstIncompleteWorkout && firstIncompleteWorkout.exercises.length > 0 && (
            <div className="TWP-submit-section">
              <button
                className={`TWP-submit-btn ${completionPercentage === 100 ? "TWP-submit-btn-ready" : ""}`}
                onClick={handleSubmitWorkout}
                disabled={completionPercentage < 100}
              >
                <span>Complete Workout</span>
                <svg className="TWP-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Modals */}
        {showDeletePopUp && exerciseToDelete && (
          <div className="TWP-modal-overlay">
            <div className="TWP-modal-content">
              <div className="TWP-modal-icon">⚠️</div>
              <h2 className="TWP-modal-title">Delete Exercise</h2>
              <p className="TWP-modal-message">
                Are you sure you want to delete <strong>{exerciseToDelete.name}</strong>?
              </p>
              <div className="TWP-modal-buttons">
                <button
                  className="TWP-modal-btn TWP-modal-btn-danger"
                  onClick={() => {
                    deleteExerciseFromCurrentDay(exerciseToDelete)
                    setShowDeletePopUp(false)
                    setExerciseToDelete(null)
                  }}
                >
                  Yes, delete
                </button>
                <button
                  className="TWP-modal-btn TWP-modal-btn-cancel"
                  onClick={() => {
                    setShowDeletePopUp(false)
                    setExerciseToDelete(null)
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {cantDeletePopUp && (
          <div className="TWP-modal-overlay">
            <div className="TWP-modal-content">
              <div className="TWP-modal-icon">🚫</div>
              <h2 className="TWP-modal-title">Can't Delete Exercise</h2>
              <p className="TWP-modal-message">
                You can't delete the only exercise in your workout. Add another exercise before removing this one.
              </p>
              <div className="TWP-modal-buttons">
                <button className="TWP-modal-btn TWP-modal-btn-cancel" onClick={() => setCantDeletePopUp(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showIncomplete && <IncompleteWorkoutPopUp onOk={() => setShowIncomplete(false)} boolean={showIncomplete} />}
      </section>
    </>
  )
}

export default TodaysWorkoutPage
