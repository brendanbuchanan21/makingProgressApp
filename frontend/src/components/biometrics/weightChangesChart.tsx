
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



interface WeightProgressChartProps {
    view: "week" | "month" | "year";
  }
  
  const WeightProgressChart: React.FC<WeightProgressChartProps> = ({ view }) => {
    const initialWeight = useSelector((state: RootState) => state.bodyWeight.initialWeight) ?? 0;
    const weightEntries = useSelector((state: RootState) => state.bodyWeight.entries);
  
    // Sort entries chronologically
    const sortedEntries = weightEntries.slice().sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  
    let labels: string[] = [];
    let dataPoints: number[] = [];
  
    if (view === "week") {
      // For week view: take the most recent 7 entries
      const recentEntries = sortedEntries.slice(-7);
      labels = recentEntries.map(entry => new Date(entry.date).toLocaleDateString());
      dataPoints = recentEntries.map(entry => entry.weight);
    } else if (view === "month") {
      // For month view: group data by week.
      // Here, we divide the sorted entries into chunks of 7 days.
      const weeks: { week: string; average: number }[] = [];
      for (let i = 0; i < sortedEntries.length; i += 7) {
        const weekEntries = sortedEntries.slice(i, i + 7);
        const weekLabel = `Week ${Math.floor(i / 7) + 1}`;
        const average =
          weekEntries.reduce((sum, entry) => sum + entry.weight, 0) / weekEntries.length;
        weeks.push({ week: weekLabel, average });
      }
      labels = weeks.map(w => w.week);
      dataPoints = weeks.map(w => w.average);
    } else if (view === "year") {
      // For year view: group entries by month.
      const monthGroups: { [key: string]: number[] } = {};
      sortedEntries.forEach(entry => {
        const dateObj = new Date(entry.date);
        const monthLabel = dateObj.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!monthGroups[monthLabel]) {
          monthGroups[monthLabel] = [];
        }
        monthGroups[monthLabel].push(entry.weight);
      });
      labels = Object.keys(monthGroups);
      dataPoints = Object.values(monthGroups).map(weights =>
        weights.reduce((sum, w) => sum + w, 0) / weights.length
      );
    }
  
    // If there are no entries, show initial weight only.
    if (dataPoints.length === 0 && initialWeight) {
      labels = ["Initial"];
      dataPoints = [initialWeight];
    }
  
    // Set Y-axis range dynamically (or use a fallback based on data)
    const yMin = initialWeight ? initialWeight - 10 : Math.min(...dataPoints) - 10;
    const yMax = initialWeight ? initialWeight + 10 : Math.max(...dataPoints) + 10;
  
    const data = {
      labels: labels,
      datasets: [
        {
          label: "Weight Over Time",
          data: dataPoints,
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
          title: { display: true, text: "Time" },
        },
      },
    };
  
    return <Line data={data} options={options} />;
  };
  
  export default WeightProgressChart;




{/*
interface WeightProgressChartProps {
    view: "week" | "month" | "year";
  }

const WeightProgressChart: React.FC<WeightProgressChartProps> = ({ view }) => {
    const initialWeight = useSelector((state: RootState) => state.bodyWeight.initialWeight) ?? 0;
    const weightEntries = useSelector((state: RootState) => state.bodyWeight.entries);


    const sortedEntries = weightEntries.slice().sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      // 2. Extract labels and weight data
      const entryLabels = sortedEntries.map(entry =>
        new Date(entry.date).toLocaleDateString()
      );
      const entryWeights = sortedEntries.map(entry => entry.weight);
      
      // 3. Optionally, include the initial weight as the first data point
      const labels = initialWeight ? ["Initial", ...entryLabels] : entryLabels;
      const dataPoints = initialWeight ? [initialWeight, ...entryWeights] : entryWeights;
    // Placeholder data for weeks (X-axis)
   // Generate x-axis labels from the entry dates
      const weeks = ["Week 1", "Week 2", "Week 3"];

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
                data: dataPoints,
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


*/}