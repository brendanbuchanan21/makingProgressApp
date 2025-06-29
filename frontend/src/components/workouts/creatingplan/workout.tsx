"use client"

import "./workouts.css"
import "../../dashboard/dashboard.css"
import NavBar from "../../dashboard/navbar"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import type { RootState } from "../../../redux/store"
import { useEffect, useState } from "react"
import addMarkerBlue from "../../../images/addMarkerBlue.svg"

const WorkoutSection = () => {
  const currentPlan = useSelector((state: RootState) => state.workout.currentPlan)
  const firstIncompleteWorkout = currentPlan?.weeks
    .flatMap((week, index) => week.days.map((day) => ({ ...day, weekNumber: index + 1 })))
    .find((day) => !day.isCompleted)

  const weekNumber = firstIncompleteWorkout?.weekNumber
  const numberOfExercises = firstIncompleteWorkout?.exercises.length
  const uniqueMuscleGroups = [...new Set(firstIncompleteWorkout?.exercises.map((exercise) => exercise.muscleGroup))]
  const currentDay = firstIncompleteWorkout?.day

  const [noPlan, setNoPlan] = useState(false)
  const [planIsComplete, setPlanIsComplete] = useState(false)
  const [isCurrentPlan, setIsCurrentPlan] = useState(false)
  const [showPlanMessage, setShowPlanMessage] = useState(false)

  useEffect(() => {
    if (!currentPlan || !currentPlan._id) {
      setNoPlan(true)
    } else {
      setNoPlan(false)
    }
  }, [currentPlan])

  useEffect(() => {
    if (currentPlan && currentPlan.weeks) {
      if (currentPlan.weeks.length === 0) {
        setPlanIsComplete(false)
      } else {
        const allDaysComplete = currentPlan.weeks.every((week) => week.days.every((day) => day.isCompleted))
        setPlanIsComplete(allDaysComplete)
      }
    } else {
      setPlanIsComplete(false)
    }
  }, [currentPlan])

  useEffect(() => {
    if (currentPlan && currentPlan.weeks.length > 0) {
      setIsCurrentPlan(true)
    } else {
      setIsCurrentPlan(false)
    }
  }, [currentPlan])

  const handleClosePopUp = () => {
    setShowPlanMessage(false)
    return
  }

  return (
    <>
      <NavBar />
      <section className="WP-section-1">
        <div className="WP-hero-section">
          <div className="WP-header-content">
            <h1 className="WP-main-title">Your Fitness Journey</h1>
            <p className="WP-subtitle">Track progress, start workouts, and achieve your goals</p>
          </div>
        </div>

        <div className="WP-dashboard-grid">
          {/* Plans & Past Workouts Card */}
          <div className="WP-card WP-card-secondary">
            <div className="WP-card-header">
              <div className="WP-card-icon">📊</div>
              <h3 className="WP-card-title">Plans & History</h3>
            </div>
            <div className="WP-card-content">
              <p className="WP-card-description">View your workout plans and track your progress</p>
            </div>
            <div className="WP-card-footer">
              <Link to="/currentPlanPage" className="WP-btn WP-btn-secondary">
                <span>View Plans</span>
                <svg className="WP-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Start Workout Card - Main Feature */}
          <div className="WP-card WP-card-primary">
            <div className="WP-card-header">
              <div className="WP-card-icon">🏋️‍♀️</div>
              <h3 className="WP-card-title">Start Workout</h3>
            </div>

            <div className="WP-card-content">
              {noPlan ? (
                <div className="WP-workout-preview">
                  <h4 className="WP-workout-title">Quick Workout</h4>
                  <p className="WP-workout-description">Jump into a personalized workout session</p>
                  <div className="WP-workout-tags">
                    <span className="WP-tag">Flexible</span>
                    <span className="WP-tag">No Plan Required</span>
                  </div>
                </div>
              ) : planIsComplete ? (
                <div className="WP-workout-preview">
                  <h4 className="WP-workout-title">Plan Complete! 🎉</h4>
                  <p className="WP-workout-description">
                    Great job! Create a new plan to continue your fitness journey
                  </p>
                  <div className="WP-workout-tags">
                    <span className="WP-tag WP-tag-success">Completed</span>
                  </div>
                </div>
              ) : (
                <div className="WP-workout-preview">
                  <h4 className="WP-workout-title">Today's Workout</h4>
                  <div className="WP-workout-details">
                    <div className="WP-detail-item">
                      <span className="WP-detail-label">Week</span>
                      <span className="WP-detail-value">{weekNumber}</span>
                    </div>
                    <div className="WP-detail-item">
                      <span className="WP-detail-label">Day</span>
                      <span className="WP-detail-value">{currentDay}</span>
                    </div>
                    <div className="WP-detail-item">
                      <span className="WP-detail-label">Exercises</span>
                      <span className="WP-detail-value">{numberOfExercises}</span>
                    </div>
                  </div>
                  <div className="WP-muscle-groups">
                    <span className="WP-muscle-label">Target Muscles:</span>
                    <div className="WP-muscle-tags">
                      {uniqueMuscleGroups.map((muscle, index) => (
                        <span key={index} className="WP-muscle-tag">
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="WP-card-footer">
              {noPlan ? (
                <Link to="/quickWorkoutPage" className="WP-btn WP-btn-primary">
                  <span>Begin Workout</span>
                  <svg className="WP-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              ) : planIsComplete ? (
                <button onClick={() => alert("Create a plan to view a plan!")} className="WP-btn WP-btn-disabled">
                  <span>Create New Plan</span>
                </button>
              ) : (
                <Link to="/todaysWorkoutPage" className="WP-btn WP-btn-primary">
                  <span>Begin Workout</span>
                  <svg className="WP-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* New Plan Card */}
          <div className="WP-card WP-card-accent">
            <div className="WP-card-header">
              <div className="WP-card-icon">✨</div>
              <h3 className="WP-card-title">Create Plan</h3>
            </div>
            <div className="WP-card-content">
              <p className="WP-card-description">Design a custom workout plan tailored to your goals</p>
            </div>
            <div className="WP-card-footer">
              {isCurrentPlan ? (
                <button className="WP-btn WP-btn-dashed" onClick={() => setShowPlanMessage(true)}>
                  <img src={addMarkerBlue || "/placeholder.svg"} alt="Add" className="WP-btn-add-icon" />
                  <span>Add Plan</span>
                </button>
              ) : (
                <Link to="/newPlanPopup" className="WP-btn WP-btn-dashed">
                  <img src={addMarkerBlue || "/placeholder.svg"} alt="Add" className="WP-btn-add-icon" />
                  <span>Add Plan</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        {showPlanMessage && (
          <div className="WP-overlay">
            <div className="WP-modal">
              <div className="WP-modal-icon">⚠️</div>
              <h3 className="WP-modal-title">Active Plan Detected</h3>
              <p className="WP-modal-message">
                You can't create a new plan while one is currently active. Complete your current plan first!
              </p>
              <button onClick={handleClosePopUp} className="WP-modal-btn">
                Got it
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  )
}

export default WorkoutSection
