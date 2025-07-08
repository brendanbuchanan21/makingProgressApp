import { Link } from "react-router-dom";
import addMarkerBlue from "../../../images/addMarkerBlue.svg"
import WeekCard from './weekCard'

type Props = {
    controls: {
    programComplete: boolean
    isEditing: boolean
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
    setShowAbandonPlan: React.Dispatch<React.SetStateAction<boolean>>
    handleSubmitPlan: () => void
    handleAddWeek: () => void
    }
}



const CurrentPlanSection = ({ controls }: Props) => {

    const {
        programComplete,
        isEditing,
        setIsEditing,
        setShowAbandonPlan,
        handleSubmitPlan,
        handleAddWeek
    } = controls;

    return (
        <section className="CPP-current-plan-section">
            <div className="CPP-hero-section">
              <div className="CPP-header-content">
                <h1 className="CPP-main-title">Current Plan</h1>
                <p className="CPP-subtitle">Track your progress and manage your workout schedule</p>
              </div>
            </div>

            <div className="CPP-controls-bar">
              <Link to="/workouts" className="CPP-btn CPP-btn-secondary">
                <svg className="CPP-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </Link>

              <div className="CPP-action-buttons">
                {programComplete ? (
                  <button className="CPP-btn CPP-btn-success" onClick={handleSubmitPlan}>
                    <svg className="CPP-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complete Program</span>
                  </button>
                ) : (
                  <button className="CPP-btn CPP-btn-outline" onClick={() => setIsEditing(!isEditing)}>
                    <svg className="CPP-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>{isEditing ? "Done Editing" : "Edit Plan"}</span>
                  </button>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="CPP-edit-controls">
                <div className="CPP-edit-actions">
                  <button className="CPP-edit-btn CPP-edit-btn-add" onClick={handleAddWeek}>
                    <img src={addMarkerBlue || "/placeholder.svg"} alt="Add Week" className="CPP-edit-icon" />
                    <span>Add Week</span>
                  </button>
                  <button className="CPP-edit-btn CPP-edit-btn-danger" onClick={() => setShowAbandonPlan(true)}>
                    <svg className="CPP-edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span>Abandon Plan</span>
                  </button>
                </div>
              </div>
            )}

            <div className="CPP-weeks-grid">
              <WeekCard isEditing={isEditing} />
            </div>
          </section>
    )
}

export default CurrentPlanSection;