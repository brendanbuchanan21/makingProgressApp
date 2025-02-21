
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeightProgressChart = () => {
    const initialWeight = useSelector((state: RootState) => state.biometric.initialWeight);

    // Placeholder data for weeks (X-axis)
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

    // Static dataset since there's only an initial weight
    const weightData = [initialWeight]; // Future weight entries will be appended

    // Set Y-axis range dynamically (20-pound range)
    const yMin = initialWeight - 10;
    const yMax = initialWeight + 10;

    const data = {
        labels: weeks,
        datasets: [
            {
                label: "Weight Over Time",
                data: weightData.concat(new Array(weeks.length - 1).fill(null)), // Only first point is set
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                min: yMin,
                max: yMax,
                title: { display: true, text: "Weight (lbs)" },
            },
            x: {
                title: { display: true, text: "Weeks" },
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default WeightProgressChart;
