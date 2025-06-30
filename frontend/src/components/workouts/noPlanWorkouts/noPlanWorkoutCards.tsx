"use client"

import "./no-plan-workout-card.css"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import {
  addingSetToExercise,
  deletingSetFromExercise,
  type noPlanSet,
  updateSetDetails,
  deletingExercise,
  exerciseComplete,
  resetQuickWorkout,
} from "../../../redux/noPlanWorkoutSlice"
import { v4 as uuidv4 } from "uuid"
import AddExerciseEntry from "./addExerciseEntry"
import { useNavigate } from "react-router-dom"
import { usePostNoPlanWorkoutMutation } from "../../../redux/noPlanWorkoutApi"
import DeleteExercisePopUp from "./noPlanDeleteExercisePopUp"
import IncompleteWorkoutPopUp from "../currentPlan/incompleteWorkoutPopUp"
import BackArrowPopUp from "./backArrowPopUp"

const NoPlanWorkoutCard = () => {
  // Redux
  const quickWorkoutState = useSelector((state: RootState) => state.quickWorkout)
  const exercises = quickWorkoutState.quickWorkout.exercises
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // useState
  const [addingExercise, setAddingExercise] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [confirmDeleteExercise, setConfirmDeleteExercise] = useState(false)
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null)
  const [showMessagePopUp, setShowMessagePopUp] = useState(false)
  const [backMessage, setBackMessage] = useState(false)

  // API queries
  const [postNoPlanWorkout] = usePostNoPlanWorkoutMutation()

  const handleAddSet = (exerciseId: string) => {
    const exercise = quickWorkoutState.quickWorkout.exercises.find((exercise) => exercise.id === exerciseId)

    if (!exercise) {
      console.error("Exercise not found")
      return
    }

    const newSetNumber = exercise?.sets.length + 1
    const newSet = {
      setNumber: newSetNumber,
      id: uuidv4(),
      reps: null,
      weight: null,
      rir: null,
    }

    dispatch(addingSetToExercise({ exerciseId, newSet }))
  }

  const handleInputChange = (
    exerciseId: string | any,
    setId: string | any,
    field: keyof noPlanSet,
    value: string | number,
  ) => {
    const parsedValue = value === "" ? null : Number(value)
    dispatch(updateSetDetails({ exerciseId, setId, updatedSet: { [field]: parsedValue } }))
  }

  const handleDeleteSet = (exerciseId: string, setId: string) => {
    const exercise = quickWorkoutState.quickWorkout.exercises.find((exercise) => exercise.id === exerciseId)

    if (!exercise) {
      console.error("Exercise not found")
      return
    }

    dispatch(deletingSetFromExercise({ exerciseId, setId }))
  }

  const handleDeleteExercise = (exerciseId: string) => {
    if (exercises.length === 1) {
      // If it's the last exercise, reset the workout and navigate away.
      dispatch(resetQuickWorkout())
      navigate("/workouts")
    } else {
      // Otherwise, simply delete the exercise.
      dispatch(deletingExercise({ exerciseId: exerciseId }))
    }
    setConfirmDeleteExercise(false)
  }

  const handleAddExercise = () => {
    setAddingExercise(true)
  }

  const handleSubmitWorkout = async () => {
    // Check if every exercise is complete
    const allExercisesComplete = exercises.every((exercise) => exercise.isComplete === true)

    if (!allExercisesComplete) {
      setShowMessagePopUp(true)
      return
    }

    const completedWorkout = {
      ...quickWorkoutState.quickWorkout,
      dateDone: new Date().toISOString(),
    }

    try {
      await postNoPlanWorkout(completedWorkout).unwrap()
      dispatch(resetQuickWorkout())
      navigate("/workouts")
    } catch (error) {
      console.error(error)
    }
  }

  const handleRemoveState = () => {
    dispatch(resetQuickWorkout())
    navigate("/workouts")
  }

  // Calculate completion progress
  const completedCount = exercises.filter((exercise) => exercise.isComplete).length
  const totalExercises = exercises.length
  const completionPercentage = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0

  return (
    <>
      {addingExercise ? (
        <AddExerciseEntry setAddingExercise={setAddingExercise} />
      ) : (
        <section className="NPW-section">
          {/* Hero Section */}
          <div className="NPW-hero-section">
            <div className="NPW-header-content">
              <button className="NPW-back-btn" onClick={() => setBackMessage(true)}>
                <svg className="NPW-back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="NPW-header-text">
                <h1 className="NPW-main-title">Quick Workout</h1>
                <p className="NPW-subtitle">Flexible workout without a plan</p>
              </div>
              <div className="NPW-edit-toggle">
                <button
                  className={`NPW-edit-btn ${editMode ? "NPW-edit-btn-active" : ""}`}
                  onClick={() => setEditMode((prev) => !prev)}
                >
                  <svg className="NPW-edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="NPW-progress-section">
              <div className="NPW-progress-header">
                <span className="NPW-progress-label">Progress</span>
                <span className="NPW-progress-text">
                  {completedCount} of {totalExercises} exercises completed
                </span>
              </div>
              <div className="NPW-progress-bar">
                <div className="NPW-progress-fill" style={{ width: `${completionPercentage}%` }} />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="NPW-container">
            {exercises.length > 0 ? (
              <div className="NPW-workout-content">
                <div className="NPW-exercises-grid">
                  {exercises.map((exercise) => (
                    <div key={exercise.id} className="NPW-exercise-card">
                      {/* Exercise Header */}
                      <div className="NPW-exercise-header">
                        <div className="NPW-exercise-info">
                          <h3 className="NPW-exercise-name">{exercise.name}</h3>
                          <span className="NPW-exercise-muscle">{exercise.muscleGroup}</span>
                        </div>
                        <div className="NPW-exercise-actions">
                          <button className="NPW-add-set-btn" onClick={() => handleAddSet(exercise.id)}>
                            <svg className="NPW-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add Set</span>
                          </button>
                          {editMode && (
                            <button
                              className="NPW-delete-exercise-btn"
                              onClick={() => {
                                setExerciseToDelete(exercise.id)
                                setConfirmDeleteExercise(true)
                              }}
                            >
                              <svg className="NPW-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <div className="NPW-sets-container">
                        <div className="NPW-sets-header">
                          <div className="NPW-header-cell NPW-set-number">Set</div>
                          <div className="NPW-header-cell">Weight</div>
                          <div className="NPW-header-cell">Reps</div>
                          <div className="NPW-header-cell">RIR</div>
                        </div>

                        <div className="NPW-sets-body">
                          {exercise.sets.map((set) => (
                            <div key={set.setNumber} className="NPW-set-row">
                              <div className="NPW-set-cell NPW-set-number-cell">
                                {editMode && (
                                  <button
                                    className="NPW-delete-set-btn"
                                    onClick={() => handleDeleteSet(exercise.id, set.id)}
                                  >
                                    <svg
                                      className="NPW-delete-icon"
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
                                <span className="NPW-set-number">{set.setNumber}</span>
                              </div>
                              <div className="NPW-set-cell">
                                <input
                                  type="number"
                                  min="0"
                                  className="NPW-set-input"
                                  placeholder="lbs"
                                  value={set.weight === null ? "" : set.weight}
                                  onChange={(e) => handleInputChange(exercise.id, set.id, "weight", e.target.value)}
                                />
                              </div>
                              <div className="NPW-set-cell">
                                <input
                                  type="number"
                                  min="0"
                                  className="NPW-set-input"
                                  placeholder="reps"
                                  value={set.reps === null ? "" : set.reps}
                                  onChange={(e) => handleInputChange(exercise.id, set.id, "reps", e.target.value)}
                                />
                              </div>
                              <div className="NPW-set-cell">
                                <input
                                  type="number"
                                  min="0"
                                  className="NPW-set-input"
                                  placeholder="rir"
                                  value={set.rir === null ? "" : set.rir}
                                  onChange={(e) => handleInputChange(exercise.id, set.id, "rir", e.target.value)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Exercise Completion */}
                      <div className="NPW-exercise-completion">
                        <label className="NPW-completion-label">
                          <input
                            type="checkbox"
                            className="NPW-completion-checkbox"
                            checked={exercise.isComplete}
                            onChange={() => dispatch(exerciseComplete({ exerciseId: exercise.id }))}
                          />
                          <span className="NPW-completion-text">Mark as Complete</span>
                          <div className="NPW-checkmark">
                            <svg className="NPW-check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Exercise Button */}
                <div className="NPW-add-exercise-section">
                  <button className="NPW-add-exercise-btn" onClick={handleAddExercise}>
                    <svg className="NPW-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Exercise</span>
                  </button>
                </div>

                {/* Submit Button */}
                <div className="NPW-submit-section">
                  <button
                    className={`NPW-submit-btn ${completionPercentage === 100 ? "NPW-submit-btn-ready" : ""}`}
                    onClick={handleSubmitWorkout}
                    disabled={completionPercentage < 100}
                  >
                    <span>Complete Workout</span>
                    <svg className="NPW-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="NPW-empty-state">
                <div className="NPW-empty-icon">🏋️‍♀️</div>
                <h3>No exercises found</h3>
                <p>Add some exercises to get started with your workout</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Modals */}
      {confirmDeleteExercise && (
        <DeleteExercisePopUp
          onConfirm={() => exerciseToDelete && handleDeleteExercise(exerciseToDelete)}
          onCancel={() => setConfirmDeleteExercise(false)}
          conditional={confirmDeleteExercise}
        />
      )}

      {showMessagePopUp && (
        <IncompleteWorkoutPopUp onOk={() => setShowMessagePopUp(false)} boolean={showMessagePopUp} />
      )}

      {backMessage && (
        <BackArrowPopUp
          onCancel={() => setBackMessage(false)}
          boolean={backMessage}
          onConfirm={() => handleRemoveState()}
        />
      )}
    </>
  )
}

export default NoPlanWorkoutCard
