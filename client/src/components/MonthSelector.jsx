import React, { useState } from 'react';

const MonthSelector = ({ onMonthChange }) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [selectedMonth, setSelectedMonth] = useState(2); 

  const handleMonthChange = (e) => {
    const monthIndex = parseInt(e.target.value); 
    setSelectedMonth(monthIndex);
    onMonthChange(monthIndex + 1); 
  };

  return (
    <select
      value={selectedMonth}
      onChange={handleMonthChange}
      className="p-2 bg-white border rounded-md"
    >
      {months.map((month, index) => (
        <option key={index} value={index}>
          {month}
        </option>
      ))}
    </select>
  );
};

export default MonthSelector;
