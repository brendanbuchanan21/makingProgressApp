"use client"

import "./currentPlanPage.css"
import WeekCard from "./weekCard"
import NavBar from "../../dashboard/navbar"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import addMarkerBlue from "../../../images/addMarkerBlue.svg"
import { useDispatch, useSelector } from "react-redux"
import { addWeek } from "../../../redux/workoutSlice"
import type { RootState } from "../../../redux/store"
import { useHandleAddWeekApiMutation } from "../../../redux/workoutApi"
import { resetWorkoutState } from "../../../redux/workoutSlice"
import { usePostCompletedProgramMutation, useGetCompletedProgramQuery } from "../../../redux/completedProgramsApi"
import { useDeleteExerciseProgramMutation } from "../../../redux/workoutApi"
import dumbbellImg from "../../../images/dumbbell-svgrepo-com.svg"
import { ClipLoader } from "react-spinners"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useGetNoPlanWorkoutsByDateQuery } from "../../../redux/noPlanWorkoutApi"
import AbandonPlanPopUp from "./abandonPlanPopUp"
import { useMemo } from "react"

const CurrentPlanPage = () => {
  const currentPlan = useSelector((state: RootState) => state.workout.currentPlan)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  //TYPES FOR TYPESCRIPT SHAPES 
   type TimeRange = "7_days" | "30_days" | "this_year" | "all_time"

  // RTK queries
  const [deleteExerciseProgram] = useDeleteExerciseProgramMutation()
  const [addWeekApi] = useHandleAddWeekApiMutation()
  const [postCompletedProgram] = usePostCompletedProgramMutation()

  //states
  const [isUserReady, setIsUserReady] = useState(false)
  const [noPlan, setNoPlan] = useState(false)
  const [selectedTab, setSelectedTab] = useState<"plans" | "quickWorkouts">("plans")
  const [showAbandonPlan, setShowAbandonPlan] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [timeRange, setTimeRange] = useState<TimeRange>("7_days");
  const [limitNumber] = useState<number>(10);
  


  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUserReady(true)
      } else {
        setIsUserReady(false)
      }
    })
    return () => unsubscribe()
  }, [auth])

  // Retrieve all past plans
  const {
    data: completedPrograms,
    error,
    isLoading,
  } = useGetCompletedProgramQuery(undefined, {
    skip: !isUserReady,
    refetchOnMountOrArgChange: true,
  })

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



  const handleTabSwitch = (tab: "plans" | "quickWorkouts") => {
    if (selectedTab !== tab) {
      setSelectedTab(tab)
    }
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date
      .toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", " at")
  }

  const handleAbandonPlan = async () => {
    await deleteExerciseProgram({ id: currentPlan._id })
    dispatch(resetWorkoutState())
    setShowAbandonPlan(false)
    setIsEditing(false)
  }
  
  // EVERYTHING BELOW THAT IS NOT THE JSX IS FOR SETTING UP WHICH QUICK WORKOUT DATES WILL BE FETCHED


  const getDateRange = (range: TimeRange) => {

    const today = new Date();
    let from: string | null = null;

    switch (range) {
      case "7_days":
        from = new Date(today.setDate(today.getDate() - 7)).toISOString();
        break;
      case "30_days":
        from = new Date(today.setDate(today.getDate() - 30)).toISOString();
        break;
      case "this_year":
        from = new Date(today.getFullYear(), 0, 1).toISOString();
        break;
      case "all_time":
        from = null;
        break;
    }
    const to = new Date().toISOString();
    return { from, to };
  };

  // TAKE THE FORMAT FUNCTION FROM ABOVE AND PUT THE TIMERANGE STATE VALUE INTO IT TO GET THE RANGE URL PARAMS
  // FOR THE QUERY OF QUICK WORKOUTS
  const memoizedDateRange = useMemo(() => getDateRange(timeRange), [timeRange]);
  const { from, to } = memoizedDateRange;

  

  const { 
  data: quickWorkouts, 
  error: quickWorkoutsError, 
  isLoading: quickWorkoutsLoading
  } = useGetNoPlanWorkoutsByDateQuery({from, to, limit: limitNumber}, {
  skip: !isUserReady,
  refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    console.log('Quick Workouts Query Result:', {
    data: quickWorkouts,
    error: quickWorkoutsError,
    loading: quickWorkoutsLoading,
  });
  }, [quickWorkouts, quickWorkoutsError, quickWorkoutsLoading]);


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
        </>
      )}

      {/* History Section - Always Visible */}
      <section className="CPP-history-section">
        <div className="CPP-history-header">
          <h2 className="CPP-history-title">
            {selectedTab === "quickWorkouts" ? "Quick Workouts History" : "Previous Plans"}
          </h2>
          <div className="CPP-tab-switcher">
            <button
              className={`CPP-tab ${selectedTab === "plans" ? "CPP-tab-active" : ""}`}
              onClick={() => handleTabSwitch("plans")}
            >
              <svg className="CPP-tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Previous Plans</span>
            </button>
            <button
              className={`CPP-tab ${selectedTab === "quickWorkouts" ? "CPP-tab-active" : ""}`}
              onClick={() => handleTabSwitch("quickWorkouts")}
            >
              <svg className="CPP-tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Quick Workouts</span>
            </button>
          </div>
        </div>

        <div className="CPP-history-content">
          {/* Time range filter only shows for quick workouts */}
          {selectedTab === "quickWorkouts" && (
          <div className="CPP-time-filter-dropdown">
            <label htmlFor="timeRangeSelect" className="CPP-dropdown-label">View Range:</label>
            <select
              id="timeRangeSelect"
              className="CPP-dropdown"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            >
              <option value="7_days">Last 7 Days</option>
              <option value="30_days">Last 30 Days</option>
              <option value="this_year">This Year</option>
              <option value="all_time">All Time</option>
            </select>
          </div>
        )}

          {selectedTab === "plans" ? (
            isLoading ? (
              <div className="CPP-loading-state">
                <ClipLoader size={50} color="var(--blue)" />
                <p>Loading previous plans...</p>
              </div>
            ) : error ? (
              <div className="CPP-error-state">
                <div className="CPP-error-icon">⚠️</div>
                <p>Error loading previous plans. Please try again.</p>
              </div>
            ) : completedPrograms?.completedPrograms?.length > 0 ? (
              <div className="CPP-history-grid">
                {completedPrograms.completedPrograms.map((program: any) => (
                  <div className="CPP-history-card CPP-plan-card" key={program._id}>
                    <div className="CPP-card-header">
                      <div className="CPP-card-icon">🏆</div>
                      <h3 className="CPP-card-title">{program.name}</h3>
                    </div>
                    <div className="CPP-card-content">
                      <div className="CPP-card-detail">
                        <span className="CPP-detail-label">Duration</span>
                        <span className="CPP-detail-value">
                          {program.startDate} - {program.endDate}
                        </span>
                      </div>
                      <div className="CPP-card-detail">
                        <span className="CPP-detail-label">Lasted</span>
                        <span className="CPP-detail-value">{program.duration}</span>
                      </div>
                      <div className="CPP-card-detail">
                        <span className="CPP-detail-label">Total Volume</span>
                        <span className="CPP-detail-value">
                          {program.totalVolume} lbs
                          <img src={dumbbellImg || "/placeholder.svg"} alt="" className="CPP-dumbbell-icon" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="CPP-empty-state">
                <div className="CPP-empty-icon">📋</div>
                <h3>No Previous Plans Found</h3>
                <p>Complete your first workout plan to see it here</p>
              </div>
            )
          ) : quickWorkoutsLoading ? (
            <div className="CPP-loading-state">
              <ClipLoader size={50} color="var(--blue)" />
              <p>Loading quick workouts...</p>
            </div>
          ) : quickWorkoutsError ? (
            <div className="CPP-error-state">
              <div className="CPP-error-icon">⚠️</div>
              <p>Error loading quick workouts. Please try again.</p>
            </div>
          ) : quickWorkouts?.length > 0 ? (
            <div className="CPP-history-grid">
              {quickWorkouts.map((workout: any) => (
                <div className="CPP-history-card CPP-workout-card" key={workout._id}>
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
                        workout.exercises.map((exercise: any) => (
                          <span key={exercise._id} className="CPP-muscle-tag">
                            {exercise.muscleGroup}
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
            </div>
          ) : (
            <div className="CPP-empty-state">
              <div className="CPP-empty-icon">⚡</div>
              <h3>No Quick Workouts Found</h3>
              <p>Start a quick workout to see your history here</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default CurrentPlanPage
