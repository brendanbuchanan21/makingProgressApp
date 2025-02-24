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


  return (
    <div className="weight-calendar-container">
      {/* Month Selector */}
      <select onChange={handleMonthChange} value={`${selectedYear}-${selectedMonth}`} className='calendar-month-selector'>
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
          const isInitialWeightDate = initialWeightDate === formattedDate;

          return (
            <div key={formattedDate} className={`calendar-cell ${hasEntry ? 'weight-logged' : ''} ${isInitialWeightDate ? 'initial-weight' : ''}`}>
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeightCalendar;



