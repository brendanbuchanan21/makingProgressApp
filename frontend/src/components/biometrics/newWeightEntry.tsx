import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface WeightEntry {
  date: string; // ISO string, e.g. "2025-03-15"
  weight: number;
}

interface WeightCalendarProps {
  weightData: WeightEntry[]; // All weight entries from Redux or props
}

const WeightCalendar: React.FC<WeightCalendarProps> = ({ weightData }) => {
  const initialWeightDate = useSelector((state: RootState) => state.bodyWeight.initialWeightDate); // Get initial weight date from Redux

  // State for selected month/year
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-indexed

  // Convert initialWeightDate to a Date object
  const minDate = initialWeightDate ? new Date(initialWeightDate) : new Date();
  const minYear = minDate.getFullYear();
  const minMonth = minDate.getMonth();

  // Handle month/year change
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [year, month] = event.target.value.split('-').map(Number);
    console.log(`Selected: Year ${year}, Month ${month}`); // ✅ Debugging
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  // Generate valid months/years starting from initialWeightDate
  const monthsOptions = [];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  for (let year = minYear; year <= currentYear; year++) {
    for (let month = year === minYear ? minMonth : 0; month <= (year === currentYear ? currentMonth : 11); month++) {
      monthsOptions.push({ year, month });
    }
  }

  // Get days in selected month
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const dates = Array.from({ length: daysInMonth }, (_, i) => new Date(selectedYear, selectedMonth, i + 1));

  console.log("Months Options Length:", monthsOptions.length);
console.log("Months Options:", monthsOptions);
console.log("Redux initialWeightDate:", initialWeightDate);

  return (
    <div className="weight-calendar-container">
      {/* Month Selector */}
      <select onChange={handleMonthChange} value={`${selectedYear}-${selectedMonth}`}>
        {monthsOptions.map(({ year, month }) => (
          <option key={`${year}-${month}`} value={`${year}-${month}`}>
            {new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </option>
        ))}
      </select>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {dates.map((date) => {
          const formattedDate = date.toISOString().split('T')[0];
          const hasEntry = weightData.some(entry => entry.date === formattedDate);

          return (
            <div key={formattedDate} className={`calendar-cell ${hasEntry ? 'weight-logged' : ''}`}>
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeightCalendar;




/*

const WeightCalendar: React.FC<WeightCalendarProps> = ({ weightData }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
  
    useEffect(() => {
      // Get the current month and year
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth(); // 0-indexed
  
      // Get number of days in the current month
      const daysInMonth = new Date(year, month + 1, 0).getDate();
  
      // Create an array of Date objects for each day of the month
      const dates = d3.range(1, daysInMonth + 1).map(day => new Date(year, month, day));
  
      // Dimensions and layout
      const cellSize = 30;
      const numCols = 7; // days of the week
      const numRows = Math.ceil(dates.length / numCols);
      const width = numCols * cellSize + 40;
      const height = numRows * cellSize + 40;
  
      // Select the SVG element and set dimensions
      const svg = d3.select(svgRef.current)
                    .attr('width', width)
                    .attr('height', height);
  
      // Clear any previous content
      svg.selectAll('*').remove();
  
      // Create a group for the calendar
      const calendarGroup = svg.append('g').attr('transform', 'translate(20,20)');
  
      // Create a rectangle for each date
      calendarGroup.selectAll('rect')
        .data(dates)
        .enter()
        .append('rect')
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('x', (d, i) => (i % numCols) * cellSize)
        .attr('y', (d, i) => Math.floor(i / numCols) * cellSize)
        .attr('fill', (d) => {
          // Check if there's an entry for this date in weightData
          const entry = weightData.find(e => new Date(e.date).toDateString() === d.toDateString());
          return entry ? '#36A2EB' : '#fff'; // Blue if logged, light gray if not
        })
        .attr('stroke', '#ccc');
  
      // Add the date text in the middle of each cell
      calendarGroup.selectAll('text')
        .data(dates)
        .enter()
        .append('text')
        .attr('x', (d, i) => (i % numCols) * cellSize + cellSize / 2)
        .attr('y', (d, i) => Math.floor(i / numCols) * cellSize + cellSize / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .text(d => d.getDate());
    }, [weightData]);
  
    return <svg ref={svgRef}></svg>;
  };
  
  export default WeightCalendar;

  */