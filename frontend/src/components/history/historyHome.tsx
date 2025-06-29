"use client"

import NavBar from "../dashboard/navbar"
import "./historyHome.css"
import TotalVolumeMuscleGroup from "./totalVolumeMuscleGroup"
import TotalVolumeChart from "./totalVolumeChart"

const HistoryHome = () => {
  return (
    <>
      <NavBar />
      <section className="HH-section">
        {/* Hero Section */}
        <div className="HH-hero-section">
          <div className="HH-header-content">
            <h1 className="HH-main-title">Workout Analytics</h1>
            <p className="HH-subtitle">Track your progress and analyze your performance over time</p>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="HH-container">
          <div className="HH-analytics-grid">
            {/* Muscle Group Volume Card */}
            <div className="HH-analytics-card">
              <div className="HH-card-header">
                <div className="HH-card-icon">📊</div>
                <div className="HH-card-title-section">
                  <h3 className="HH-card-title">Muscle Group Volume</h3>
                  <p className="HH-card-description">Total volume lifted per muscle group</p>
                </div>
              </div>
              <div className="HH-card-content">
                <TotalVolumeMuscleGroup />
              </div>
            </div>

            {/* Total Volume Trends Card */}
            <div className="HH-analytics-card">
              <div className="HH-card-header">
                <div className="HH-card-icon">📈</div>
                <div className="HH-card-title-section">
                  <h3 className="HH-card-title">Volume Trends</h3>
                  <p className="HH-card-description">Track your total volume over time</p>
                </div>
              </div>
              <div className="HH-card-content">
                <TotalVolumeChart />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HistoryHome
