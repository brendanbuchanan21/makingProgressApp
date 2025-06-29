"use client"

import "./new-plan-popup.css"
import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentPlan } from "../../../redux/workoutSlice"
import type { RootState } from "../../../redux/store"
import NavBar from "../../dashboard/navbar" // Ensure this import is correct
import { usePostWorkoutPlanMutation } from "../../../redux/workoutApi"

interface NewPlanPopupProps {
  onClose: () => void
}

const NewPlanPopup = ({ onClose }: NewPlanPopupProps): JSX.Element => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Access the current workout plan from the Redux store
  const currentPlan = useSelector((state: RootState) => state.workout.currentPlan)
  const userId = useSelector((state: RootState) => state.user.userId)

  const [workoutDays, setWorkoutDays] = useState<string[]>([])
  const [programDuration, setProgramDuration] = useState<string>(currentPlan?.duration || "")
  const [planName, setPlanName] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [error, setError] = useState(false)

  // Using the RTK mutation hook
  const [postWorkoutPlan] = usePostWorkoutPlanMutation()

  const handleDayClick = (day: string) => {
    const updatedDays = workoutDays.includes(day) ? workoutDays.filter((d) => d !== day) : [...workoutDays, day]
    setWorkoutDays(updatedDays)
  }

  const handleDurationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedDuration = event.target.value
    setProgramDuration(updatedDuration)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!startDate || workoutDays.length === 0 || !programDuration || !userId) {
      setError(true)
      console.error("Missing required fields.")
      return
    }

    const numberOfWeeks = Number.parseInt(programDuration.split(" ")[0])

    const weeks = Array.from({ length: numberOfWeeks }, (_, i) => ({
      weekNumber: i + 1,
      days: workoutDays.map((day) => ({
        day: day,
        exercises: [],
      })),
    }))

    // Create a new plan object (in case no plan exists yet)
    const newPlan = {
      name: planName,
      exercises: [], // Will add exercises later
      days: workoutDays,
      duration: programDuration,
      startDate: startDate,
      weeks,
    }

    try {
      const returnedPlan = await postWorkoutPlan(newPlan).unwrap()
      console.log("Workout plan received from backend:", returnedPlan)

      // Update the state of the current plan
      dispatch(setCurrentPlan(returnedPlan))
      navigate("/submitworkoutpg")
    } catch (error) {
      console.error("Error posting our workout:", error)
    }
  }

  const handleClose = () => {
    onClose()
    navigate("/workouts")
  }

  return (
    <>
      <NavBar />
      <section className="NPP-section">
        <div className="NPP-hero-section">
          <div className="NPP-header-content">
            <h1 className="NPP-main-title">Create New Plan</h1>
            <p className="NPP-subtitle">Design your personalized workout journey</p>
          </div>
        </div>

        <div className="NPP-container">
          <div className="NPP-card">
            <div className="NPP-card-header">
              <div className="NPP-card-icon">✨</div>
              <h2 className="NPP-card-title">Plan Details</h2>
              <button className="NPP-close-btn" onClick={handleClose}>
                <svg className="NPP-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="NPP-form">
              {/* Plan Name */}
              <div className="NPP-form-group">
                <label className="NPP-label">Plan Name</label>
                <div className="NPP-input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter your plan name"
                    className="NPP-input"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                  />
                  <svg className="NPP-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Start Date */}
              <div className="NPP-form-group">
                <label htmlFor="start-date" className="NPP-label">
                  Start Date
                </label>
                <div className="NPP-input-wrapper">
                  <input
                    type="date"
                    id="start-date"
                    name="start-date"
                    className="NPP-input NPP-date-input"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <svg className="NPP-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Workout Days */}
              <div className="NPP-form-group">
                <label className="NPP-label">Workout Days</label>
                <p className="NPP-description">Select the days you plan to workout</p>
                <div className="NPP-days-grid">
                  {["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"].map((day) => (
                    <button
                      key={day}
                      type="button"
                      className={`NPP-day-btn ${workoutDays.includes(day) ? "NPP-day-btn-selected" : ""}`}
                      onClick={() => handleDayClick(day)}
                    >
                      <span className="NPP-day-text">{day}</span>
                      {workoutDays.includes(day) && (
                        <svg className="NPP-day-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
                <div className="NPP-disclaimer">
                  <svg className="NPP-disclaimer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <p>You can complete these workouts on any day, not just the scheduled days</p>
                </div>
              </div>

              {/* Program Duration */}
              <div className="NPP-form-group">
                <label className="NPP-label">Program Duration</label>
                <p className="NPP-description">How long will this program last?</p>
                <div className="NPP-select-wrapper">
                  <select value={programDuration} onChange={handleDurationChange} className="NPP-select">
                    <option value="" disabled>
                      Select Duration
                    </option>
                    {["2 weeks", "3 weeks", "4 weeks", "5 weeks", "6 weeks", "7 weeks", "8 weeks"].map((duration) => (
                      <option key={duration} value={duration}>
                        {duration}
                      </option>
                    ))}
                  </select>
                  <svg className="NPP-select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="NPP-error">
                  <svg className="NPP-error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <p>Please fill out all fields before proceeding</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="NPP-form-actions">
                <button type="button" className="NPP-btn NPP-btn-secondary" onClick={handleClose}>
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  className="NPP-btn NPP-btn-primary"
                  disabled={workoutDays.length === 0 || !programDuration}
                >
                  <span>Create Plan</span>
                  <svg className="NPP-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default NewPlanPopup
