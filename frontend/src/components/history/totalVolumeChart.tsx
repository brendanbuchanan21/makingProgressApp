import { useEffect, useState } from 'react';
import { useGetTotalVolumeQuery } from '../../redux/volumeApi';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import './historyHome.css'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);


interface volumeData {
    id: string;
    totalVolume: number;
  }


const TotalVolumeChart = () => {

  const [timescale, setTimescale] = useState('week'); // Default to 'week'


  const [isUserReady, setIsUserReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      
      if(user) {
        setUserId(user.uid);
        setIsUserReady(true);
      } else {
        setUserId(null);
        setIsUserReady(false);
      }
    });

      return () => unsubscribe();
  }, [auth])



  const { data, error, isLoading } = useGetTotalVolumeQuery(timescale, {
    skip: !isUserReady,
    refetchOnMountOrArgChange: true,
  }); // Fetch data based on timescale

  const handleTimescaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimescale(event.target.value); // Update timescale when user selects a new one
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error loading data</div>; // Show error if the request fails
  }
  const formatWeekLabel = (weekId: string) => {
    const [year, week] = weekId.split('-').map(Number);
    
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset = (week - 1) * 7;
    const firstDayOfWeek = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysOffset));

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

    return `${firstDayOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${lastDayOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  };

  const chartData = {
    labels: data?.map((item: volumeData) => timescale === 'week' ? formatWeekLabel(item.id) : item.id), // Use timescale (week/month/year) as labels
    datasets: [
      {
        label: 'Total Volume',
        data: data?.map((item: volumeData) => item.totalVolume), // Total volume data
        backgroundColor: 'rgba(20, 20, 210, 0.15)', // Softer blue with transparency
        borderWidth: 2, // Clean, slightly bold line
        pointRadius: 5, // More visible points
        pointBackgroundColor: '#1414d2', // Deep blue for points
        pointBorderColor: '#ffffff', // White outline for better visibility
        fill: true, // Fills area under the line
        tension: 0.3, // Smooths out the line
      }
    ]
  };
  return (
    <div className='line-chart-total-volume-biggest-container'> 
      {/* Timescale selector */}
      <div className='week-view-month-line-graph-select-div'>
      <select onChange={handleTimescaleChange} value={timescale} className='time-scale-select'>
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
