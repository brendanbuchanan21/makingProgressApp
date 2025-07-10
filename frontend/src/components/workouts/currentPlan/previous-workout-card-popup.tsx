"use client"

import React from "react"
import "./previous-workout-card-popup.css"



type PreviousWorkoutCardPopupProps = {
  workoutId: string
  workoutData?: any // Optional for now since logic will come later
  onClose: () => void
}

const PreviousWorkoutCardPopup: React.FC<PreviousWorkoutCardPopupProps> = ({ workoutId, workoutData, onClose }) => {
  // Handle overlay click to close
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Handle escape key to close
  React.useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => document.removeEventListener("keydown", handleEscapeKey)
  }, [onClose])

  // extract the correct workout data based on the workoutId
  const workout = workoutData?.find((workout: any) => workout._id === workoutId)

  console.log("Selected workout data:", workout);

  const date = workout?.dateDone;

  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formattedDate;
  }



  return (
    <div className="CPP-previous-workout-popup-overlay" onClick={handleOverlayClick}>
      <div className="CPP-previous-workout-popup-card">
        {/* Close Button */}
        <button className="CPP-close-button" onClick={onClose} aria-label="Close popup">
          <svg className="CPP-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="CPP-popup-header">
          <h2 className="CPP-popup-title">Previous Workout</h2>
          {workoutData && (
            <p className="CPP-popup-subtitle">
                <span className="CPP-date-label">Date:</span> {formatDate(date)}
            </p>
          )}
        </div>

        {/* Content */}
        {workout && workout.exercises.length > 0 ? (
          workout.exercises.map((exercise: any) => (
            <div key={exercise._id} className="CPP-previous-workout-popup-individual-exercise-container">
              {/* Exercise Name */}
              <p>{exercise.name}</p>

              {/* Sets Container */}
              <div className="CPP-sets-container">
                {/* Sets Header */}
                <div className="CPP-sets-header">
                  <div className="CPP-header-cell">Set</div>
                  <div className="CPP-header-cell">Weight</div>
                  <div className="CPP-header-cell">Reps</div>
                  <div className="CPP-header-cell">RIR</div>
                </div>

                {/* Sets Data */}
                {exercise.sets.map((set: any) => (
                  <div key={set._id} className="CPP-individual-set-container">
                    <div className="CPP-set-cell">
                      <span className="CPP-set-number">{set.setNumber}</span>
                    </div>
                    <div className="CPP-set-cell">
                      <span className="CPP-set-value">{set.weight !== null ? `${set.weight} lbs` : "-"}</span>
                    </div>
                    <div className="CPP-set-cell">
                      <span className="CPP-set-value">{set.reps !== null ? set.reps : "-"}</span>
                    </div>
                    <div className="CPP-set-cell">
                      <span className="CPP-set-value">{set.rir !== null ? set.rir : "-"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="CPP-empty-state">
            <div className="CPP-empty-icon">🏋️‍♀️</div>
            <h3>No workout data available</h3>
            <p>This workout data could not be loaded or doesn't exist.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PreviousWorkoutCardPopup
