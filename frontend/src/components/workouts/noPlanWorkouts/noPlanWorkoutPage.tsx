"use client"

import NavBar from "../../dashboard/navbar"
import NoPlanWorkoutCard from "./noPlanWorkoutCards"
import { useEffect, useState } from "react"
import AddExerciseEntry from "./addExerciseEntry"
import "./noPlanWorkoutPage.css"
import { useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import { useNavigate } from "react-router-dom"

const WorkoutTemplate = () => {
  // Redux
  const quickWorkout = useSelector((state: RootState) => state.quickWorkout)

  // useState
  const [exercises, setExercises] = useState(false)
  const [addingExercise, setAddingExercise] = useState(false)
  const navigate = useNavigate()

  const handleAddingExercise = () => {
    setAddingExercise(true)
  }

  const handleBackClick = () => {
    navigate("/workouts")
  }

  const Exercises = quickWorkout.quickWorkout.exercises

  useEffect(() => {
    if (Exercises.length >= 1) {
      setExercises(true)
    } else {
      setExercises(false)
    }
  }, [Exercises])

  return (
    <>
      <NavBar />

      {exercises ? (
        <NoPlanWorkoutCard />
      ) : (
        <section className="WT-section">
          {/* Hero Section */}
          <div className="WT-hero-section">
            <div className="WT-header-content">
              <button className="WT-back-btn" onClick={handleBackClick}>
                <svg className="WT-back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="WT-header-text">
                <h1 className="WT-main-title">Quick Workout</h1>
                <p className="WT-subtitle">Create a flexible workout without a plan</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="WT-container">
            <div className="WT-empty-state">
              <div className="WT-empty-content">
                <div className="WT-empty-icon">🏋️‍♀️</div>
                <h2 className="WT-empty-title">Ready to Start?</h2>
                <p className="WT-empty-description">
                  Begin by adding your first exercise to create a personalized workout session
                </p>

                <button className="WT-add-exercise-btn" onClick={handleAddingExercise}>
                  <div className="WT-btn-icon-wrapper">
                    <svg className="WT-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="WT-btn-text">Add Exercise</span>
                </button>

                <div className="WT-features-grid">
                  <div className="WT-feature-item">
                    <div className="WT-feature-icon">⚡</div>
                    <span className="WT-feature-text">Quick & Flexible</span>
                  </div>
                  <div className="WT-feature-item">
                    <div className="WT-feature-icon">🎯</div>
                    <span className="WT-feature-text">Custom Exercises</span>
                  </div>
                  <div className="WT-feature-item">
                    <div className="WT-feature-icon">📊</div>
                    <span className="WT-feature-text">Track Progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {addingExercise && <AddExerciseEntry setAddingExercise={setAddingExercise} />}
    </>
  )
}

export default WorkoutTemplate
