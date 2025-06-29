"use client"

import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js"
import { useEffect, useState } from "react"
import { useGetTotalMuscleGroupVolumeQuery } from "../../redux/volumeApi"
import { getAuth, onAuthStateChanged } from "firebase/auth"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const TotalVolumeMuscleGroup = () => {
  const [isUserReady, setIsUserReady] = useState(false)
  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserReady(!!user)
    })
    return () => unsubscribe()
  }, [auth])

  const allMuscleGroups = ["Chest", "Back", "Shoulders", "Triceps", "Biceps", "Legs", "Calves", "Abs"]

  const { data, isLoading } = useGetTotalMuscleGroupVolumeQuery(undefined, {
    skip: !isUserReady,
    refetchOnMountOrArgChange: true,
  })

  const muscleGroupVolume = Array.isArray(data) ? data : []
  const muscleVolumeMap: Record<string, number> = Object.fromEntries(allMuscleGroups.map((muscle) => [muscle, 0]))

  muscleGroupVolume.forEach((group) => {
    muscleVolumeMap[group.id] = group.totalVolume
  })

  const backgroundColors = allMuscleGroups.map((_, index) => {
    const hue = (index * 45) % 360
    return `hsla(${hue}, 70%, 60%, 0.8)`
  })

  const borderColors = allMuscleGroups.map((_, index) => {
    const hue = (index * 45) % 360
    return `hsla(${hue}, 70%, 50%, 1)`
  })

  const chartData = {
    labels: allMuscleGroups,
    datasets: [
      {
        label: "Total Volume (lbs)",
        data: allMuscleGroups.map((muscle) => muscleVolumeMap[muscle]),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
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
            size: 11,
            weight: 500, // ✅ Changed from "500" to 500
          },
          maxRotation: 45,
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
            weight: 500, // ✅ Changed from "500" to 500
          },
        },
      },
    },
  }

  if (isLoading) {
    return (
      <div className="HH-loading-state">
        <div className="HH-loading-spinner"></div>
        <p>Loading muscle group data...</p>
      </div>
    )
  }

  return (
    <div className="HH-chart-container">
      <div className="HH-chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}

export default TotalVolumeMuscleGroup
