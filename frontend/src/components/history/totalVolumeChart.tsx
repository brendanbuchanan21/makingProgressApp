import { useState } from 'react';
import { useGetTotalVolumeQuery } from '../../redux/volumeApi';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import './historyHome.css'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);


interface volumeData {
    id: string;
    totalVolume: number;
  }


const TotalVolumeChart = () => {
  const [timescale, setTimescale] = useState('week'); // Default to 'week'

  const { data, error, isLoading } = useGetTotalVolumeQuery(timescale); // Fetch data based on timescale

  const handleTimescaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimescale(event.target.value); // Update timescale when user selects a new one
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error loading data</div>; // Show error if the request fails
  }

  const chartData = {
    labels: data?.map((item: volumeData) => item.id), // Use timescale (week/month/year) as labels
    datasets: [
      {
        label: 'Total Volume',
        data: data?.map((item: volumeData) => item.totalVolume), // Total volume data
        borderColor: '#0f0fb8', // Bright electric blue line
        backgroundColor: 'rgba(20, 20, 210, 0.2)', // Slightly transparent deep blue fill
        borderWidth: 2, // Thicker line for better visibility
        pointRadius: 4, // Visible data points
        pointBackgroundColor: '#0f0fb8', // Blue points matching the line
        pointBorderColor: '#ffffff', // White outline for contrast
        fill: true, // Fills area under the line
        tension: 0.3, // Smooths out the line
      }
    ]
  };

  return (
    <div className='line-chart-total-volume-biggest-container'> 
      {/* Timescale selector */}
      <div className='week-view-month-line-graph-select-div'>
      <select onChange={handleTimescaleChange} value={timescale}>
        <option value="week">Week</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
      </select>
      </div>
        <h1>Total Volume Comparison</h1>
      {/* Bar chart */}
      <div className="line-chart-main-container">
      <Line data={chartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default TotalVolumeChart;
