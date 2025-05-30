import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react'
import { useGetTotalMuscleGroupVolumeQuery } from '../../redux/volumeApi';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const TotalVolumeMuscleGroup = () => {

    const [isUserReady, setIsUserReady] = useState(false);


    const auth = getAuth()
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user) {
                setIsUserReady(true);
            } else {
                setIsUserReady(false)
            }
        });
        return () => unsubscribe();
    }, [auth])



    const allMuscleGroups = ['Chest', 'Back', 'Shoulders', 'Triceps', 'Biceps', 'Legs', 'Calves', 'Abs'];

    const { data, isLoading } = useGetTotalMuscleGroupVolumeQuery(undefined, {
        skip: !isUserReady,
        refetchOnMountOrArgChange: true,
    });

    // Ensure data is an array, or fallback to an empty array
    const muscleGroupVolume = Array.isArray(data) ? data : [];

    // Create a map for muscle group volumes with default values
    const muscleVolumeMap: Record<string, number> = Object.fromEntries(
        allMuscleGroups.map((muscle) => [muscle, 0])
    );

    // Populate map with actual data from API response
    muscleGroupVolume.forEach((group) => {
        
            muscleVolumeMap[group.id] = group.totalVolume;
    });

    // Data for the chart
    const chartData = {
        labels: allMuscleGroups,
        datasets: [
            {
                label: 'Total Volume per Muscle Group',
                data: allMuscleGroups.map((muscle) => muscleVolumeMap[muscle]),
                backgroundColor: 'rgba(20, 20, 210, 0.2)', // Soft fill with slight transparency
                borderWidth: 2, // Thicker line for better visibility
                pointRadius: 5, // Slightly larger points for visibility
                pointBackgroundColor: '#0f0fb8', // Matches the border color
                pointBorderColor: '#ffffff', // White outline for contrast
                fill: true, // Smooth area fill
                tension: 0.3, // Smooth curve for aesthetics
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
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