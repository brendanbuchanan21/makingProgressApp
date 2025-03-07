import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useState } from 'react'
import { useGetTotalMuscleGroupVolumeQuery } from '../../redux/volumeApi';



ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const TotalVolumeMuscleGroup = () => {



    const allMuscleGroups = ['Chest', 'Back', 'Shoulders', 'Triceps', 'Biceps', 'Legs', 'Calves', 'Abs'];

    const { data, isLoading } = useGetTotalMuscleGroupVolumeQuery();

    // Ensure data is an array, or fallback to an empty array
    const muscleGroupVolume = Array.isArray(data) ? data : [];

    // Create a map for muscle group volumes with default values
    const muscleVolumeMap: Record<string, number> = Object.fromEntries(
        allMuscleGroups.map((muscle) => [muscle, 0])
    );

    // Populate map with actual data from API response
    muscleGroupVolume.forEach((group) => {
        if (muscleVolumeMap.hasOwnProperty(group.id)) {
            muscleVolumeMap[group.id] = group.totalVolume;
        }
    });

    // Data for the chart
    const chartData = {
        labels: allMuscleGroups,
        datasets: [
            {
                label: 'Total Volume per Muscle Group',
                data: allMuscleGroups.map((muscle) => muscleVolumeMap[muscle]),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };


    return (
        <div className='bar-graph-main-container'>
             {isLoading ? (
                <p>Loading muscle group volume...</p>
            ) : (
                <Bar data={chartData} options={options} />
            )}
        </div>
    )
}

export default TotalVolumeMuscleGroup;