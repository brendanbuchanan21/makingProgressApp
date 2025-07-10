import React, { useState } from 'react';
import PreviousWorkoutCardPopup from './previous-workout-card-popup'

interface PreviousWorkoutCardProps {
    workouts: any[];
    formatDate: (isoString: string) => string;
}

const PreviousWorkoutCard: React.FC<PreviousWorkoutCardProps> = ({workouts, formatDate}) => {

    // COMPONENT STATE
    const [workoutPopup, setWorkoutPopup] = useState(false);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>("");


    const handleClosePopup = () => {
        setWorkoutPopup(!workoutPopup);
    }

    return (
        <>
        {workouts.map((workout: any) => (
                <div className="CPP-history-card CPP-workout-card" key={workout._id} onClick={() => {
                  setWorkoutPopup(!workoutPopup);
                  setSelectedWorkoutId(workout._id);
                  console.log("Clicked workout ID:", workout._id);
                }}>
                  <div className="CPP-card-header">
                    <div className="CPP-card-icon">⚡</div>
                    <h3 className="CPP-card-title">Quick Workout</h3>
                  </div>
                  <div className="CPP-card-content">
                    <div className="CPP-card-detail">
                      <span className="CPP-detail-label">Completed</span>
                      <span className="CPP-detail-value">{formatDate(workout.dateDone)}</span>
                    </div>
                    <div className="CPP-muscle-groups">
                      {Array.isArray(workout.exercises) ? (
                        (Array.from(
                        new Set(workout.exercises.map((exercise: any) => exercise.muscleGroup))
                        ) as string[]).map((group, index) => (
                        <span key={index} className="CPP-muscle-tag">
                          {group}
                        </span>
                      ))
                        ) : (
                        <span className="CPP-no-exercises">No exercises found</span>
                      )}
                    </div>
                    <div className="CPP-card-detail">
                      <span className="CPP-detail-label">Total Volume</span>
                      <span className="CPP-detail-value">{workout.totalVolume} lbs</span>
                    </div>
                  </div>
                </div>

        
              ))}

              {workoutPopup && (
                  <>
                 <PreviousWorkoutCardPopup workoutId={selectedWorkoutId} workoutData={workouts} onClose={handleClosePopup}/>
                 </>
                )
                }
        </>
    )
}
export default PreviousWorkoutCard;