"use client"

import React, { useEffect, useState } from "react"
import { useGetTotalVolumeQuery } from "../../redux/volumeApi"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js"
import "./historyHome.css"
import { getAuth, onAuthStateChanged } from "firebase/auth"

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend)

interface volumeData {
  id: string
  totalVolume: number
}

const TotalVolumeChart = () => {
  const [timescale, setTimescale] = useState("week")
  const [isUserReady, setIsUserReady] = useState(false)
  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserReady(!!user)
    })
    return () => unsubscribe()
  }, [auth])

  const { data, error, isLoading } = useGetTotalVolumeQuery(timescale, {
    skip: !isUserReady,
    refetchOnMountOrArgChange: true,
  })

  const handleTimescaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimescale(event.target.value)
  }

  const formatWeekLabel = (weekId: string) => {
    const parts = weekId.split("-W")
    if (parts.length !== 2) {
      return "Invalid Week ID"
    }

    const year = Number.parseInt(parts[0], 10)
    const week = Number.parseInt(parts[1], 10)
    const firstDayOfYear = new Date(year, 0, 1)
    const daysOffset = (week - 1) * 7
    const firstDayOfWeek = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysOffset))
    const lastDayOfWeek = new Date(firstDayOfWeek)
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6)

    return `${firstDayOfWeek.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${lastDayOfWeek.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
  }

  if (isLoading) {
    return (
      <div className="HH-loading-state">
        <div className="HH-loading-spinner"></div>
        <p>Loading volume trends...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="HH-error-state">
        <div className="HH-error-icon">⚠️</div>
        <p>Error loading volume data</p>
      </div>
    )
  }

  const chartData: ChartData<"line"> = {
    labels: data?.map((item: volumeData) => (timescale === "week" ? formatWeekLabel(item.id) : item.id)),
    datasets: [
      {
        label: "Total Volume (lbs)",
        data: data?.map((item: volumeData) => item.totalVolume),
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748b",
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(226, 232, 240, 0.5)",
        },
        ticks: {
          color: "#64748b",
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
    },
  }

  return (
    <div className="HH-chart-container">
      <div className="HH-chart-controls">
        <div className="HH-select-wrapper">
          <select onChange={handleTimescaleChange} value={timescale} className="HH-timescale-select">
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
          <svg className="HH-select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="HH-chart-wrapper">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}

export default TotalVolumeChart
