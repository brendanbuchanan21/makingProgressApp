import './currentPlanPage.css'
import { ClipLoader } from "react-spinners"
import { useEffect } from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useState } from 'react'
import { useGetCompletedProgramQuery } from '../../../redux/completedProgramsApi'
import { useGetNoPlanWorkoutsByDateQuery } from '../../../redux/noPlanWorkoutApi'
import { useMemo } from 'react'
import PreviousWorkoutCard from './previous-workout-card'
import PreviousPlansCard from './previous-plans-card'


const PreviousPlanSection = () => {

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

    //TYPES FOR TYPESCRIPT SHAPES 
   type TimeRange = "7_days" | "30_days" | "this_year" | "all_time"
   const [timeRange, setTimeRange] = useState<TimeRange>("7_days");
   const [limitNumber] = useState<number>(10);
   const [isUserReady, setIsUserReady] = useState(false)
   const [selectedTab, setSelectedTab] = useState<"plans" | "quickWorkouts">("plans")


   // Retrieve all past plans
  const {
    data: completedPrograms,
    error,
    isLoading,
  } = useGetCompletedProgramQuery(undefined, {
    skip: !isUserReady,
    refetchOnMountOrArgChange: true,
  })


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
  
    // memoize the date values so it doesn't cause infinite render
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


    return (
        <>
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
                {/* Pass the completed programs to the PreviousPlansCard component */}
                <PreviousPlansCard plans={completedPrograms.completedPrograms} />
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
                <PreviousWorkoutCard workouts={quickWorkouts} formatDate={formatDate}/>
            </div>
          ) : (
            <div className="CPP-empty-state">
              <div className="CPP-empty-icon">⚡</div>
              <h3>{timeRange === "7_days"
                  ? "No Quick Workouts in the Last 7 Days"
                  : timeRange === "30_days"
                  ? "No Quick Workouts in the Last 30 Days"
                  : timeRange === "this_year"
                  ? "No Quick Workouts This Year"
                  : "No Quick Workouts"}
              </h3>
              <p>Start a quick workout to see your history here</p>
            </div>
          )}
        </div>
      </section>
        </>
    )
}
export default PreviousPlanSection;